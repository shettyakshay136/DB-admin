import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import CustomTable from "../../component/table/CustomTable";
import { db } from "../../firebaseConfig";
import { TripsResponse, UserInterface } from "../users/types";
import { exportToExcel } from "../../utils/excel";

const Trips = () => {
    const navigate = useNavigate();

    const { uid = "" } = useParams();

    const [userData, setUserData] = useState<UserInterface | null>(null);
    const [originalData, setOriginalData] = useState<TripsResponse[]>([]);
    const [displayData, setDisplayData] = useState<TripsResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [lLimit, setlLimit] = useState(10);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [page, lLimit]);

    useEffect(() => {
        if (originalData?.length > 0) {
            updateDisplayData();
        }
    }, [page, lLimit, originalData]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const userDocRef = doc(db, "User", uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data() as UserInterface;

                const tripsCollectionRef = collection(userDocRef, "trips");
                const tripsSnapshot = await getDocs(tripsCollectionRef);
                const tripsData = tripsSnapshot.docs.map((doc) => doc.data());
                userData.trips = tripsData as TripsResponse[];

                setTotal(userData?.trips ? userData?.trips?.length : 0);
                setOriginalData(userData?.trips as TripsResponse[]);
                setUserData(userData);
                setLoading(false);

                const firstTrip = userData?.trips?.[0];
                if (firstTrip) {
                    setSelectedYear(new Date(firstTrip.startTime.seconds * 1000).getFullYear().toString());
                    setSelectedMonth(new Date(firstTrip.startTime.seconds * 1000).toLocaleString("default", { month: "long" }));
                }
            } else {
                setError("User not found");
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const updateDisplayData = () => {
        const startIndex = (page - 1) * lLimit;
        const endIndex = startIndex + lLimit;
        const slicedData = originalData.slice(startIndex, endIndex);
        setDisplayData(slicedData);
    };

    const onLimitChange = (paramLimit: number) => {
        setPage(1);
        setlLimit(paramLimit);
    };

    const totalPages = useMemo(() => {
        return Math.ceil(originalData?.length / lLimit) || 1;
    }, [originalData, lLimit]);

    const onPageNumClick = (currPageNum: number) => {
        setPage(currPageNum);
    };

    const onNextOrPrevious = (change: number = 1) => {
        setPage(page + change);
    };

    const columns = [
        {
            title: "#",
            key: "tripId",
            render: (_: TripsResponse, srNo: number) => {
                return <span>{srNo}</span>;
            },
        },
        {
            title: "START ADDRESS",
            key: "startAddress",
            render: (record: TripsResponse) => {
                return <span>{record.startAddress}</span>;
            },
        },
        {
            title: "Destination Address",
            key: "destinationAddress",
            render: (record: TripsResponse) => {
                return <span>{record.destinationAddress}</span>;
            },
        },
        {
            title: "START TIME",
            key: "startTime",
            render: (record: TripsResponse) => {
                return <span>{new Date(record?.startTime?.seconds * 1000).toLocaleString()}</span>;
            },
        },
        {
            title: "END TIME",
            key: "endTrips",
            render: (record: TripsResponse) => {
                return <span>{new Date(record?.endTime?.seconds * 1000).toLocaleString()}</span>;
            },
        },
        {
            title: "Distance Travelled",
            key: "distanceTravelled",
            render: (record: TripsResponse) => {
                const regex = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s*(km|m))?/gi;

                const distance = record.distance.match(regex);
                if (distance) {
                    const tripDistance = distance.map((match) => Number(match.replace(/[^0-9.]/g, ""))).reduce((a, b) => a + b, 0);
                    return total + tripDistance;
                }

                return <span>{distance + " km"}</span>;
            },
        },
        {
            title: "ACTIVE TRIP",
            key: "activeTrip",
            render: (record: TripsResponse) => {
                return <span>{record?.activeTrip ? "Yes" : "No"}</span>;
            },
        },
    ];

    const getTotalDistance = (userData: UserInterface) => {
        const regex = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s*(km|m))?/gi;

        const distance = userData?.trips?.reduce((total, trip) => {
            const matched = trip.distance.match(regex);
            if (matched) {
                const tripDistance = matched.map((match) => Number(match.replace(/[^0-9.]/g, ""))).reduce((a, b) => a + b, 0);
                return total + tripDistance;
            }
            return total;
        }, 0);

        return distance + " km";
    };

    const yearsForDropdown = useMemo(() => {
        const years = originalData?.map((trip) => new Date(trip.startTime.seconds * 1000).getFullYear());
        return [...new Set(years)];
    }, [originalData]);

    const monthsForDropdown = useMemo(() => {
        const tripsForSelectedYear = originalData?.filter(
            (trip) => new Date(trip.startTime.seconds * 1000).getFullYear() === Number(selectedYear)
        );

        const months = tripsForSelectedYear?.map((trip) =>
            new Date(trip.startTime.seconds * 1000).toLocaleString("default", { month: "long" })
        );

        return [...new Set(months)];
    }, [originalData, selectedYear]);

    const handleExport = () => {
        const dataForExport = displayData.filter(
            (trip) =>
                new Date(trip.startTime.seconds * 1000).getFullYear() === Number(selectedYear) &&
                new Date(trip.startTime.seconds * 1000).toLocaleString("default", { month: "long" }) === selectedMonth
        );

        if (dataForExport.length === 0) {
            alert("No data to export");
            return;
        }

        const exportData: Record<string, unknown>[] = [];
        const exportFields: any[] = [
            "tripId",
            "startAddress",
            "destinationAddress",
            "startTime",
            "endTime",
            "distanceTravelled",
            "activeTrip",
            "totalDistance",
        ];

        const headers = ["Trip ID", "Start Address", "Destination Address", "Start Time", "End Time", "Distance Travelled", "Active Trip","Total Distance"];

        dataForExport.forEach((trip: any) => {
            const tripData: Record<string, unknown> = {};
            exportFields.forEach((field) => {
                tripData[field] = trip[field as keyof typeof trip];

                if (field === "startTime" || field === "endTime") {
                    tripData[field] = new Date(trip[field as keyof typeof trip].seconds * 1000).toLocaleString();
                }

                if (field === "activeTrip") {
                    tripData[field] = trip[field as keyof typeof trip] ? "Yes" : "No";
                }

                if (field === "distanceTravelled") {
                    const regex = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s*(km|m))?/gi;

                    const distance = trip.distance.match(regex);
                    if (distance) {
                        const tripDistance = distance
                            .map((match: any) => Number(match.replace(/[^0-9.]/g, "")))
                            .reduce((a: any, b: any) => a + b, 0);
                        tripData[field] = tripDistance + " km";
                    }
                }
            });
            exportData.push(tripData);
        });
        exportData[exportData.length-1] = {...exportData[exportData.length-1] , 'totalDistance' : getTotalDistance(userData as UserInterface)};
        console.log(exportData);
        exportToExcel(exportData, `Trips_${selectedMonth}_${selectedYear}`, headers);
    };

    return (
        <div className="mt-5">
            <div className="flex w-full items-center">
                <div className="flex-2 mb-5" onClick={() => navigate("/users")}>
                    <IoArrowBackCircleOutline className="cursor-pointer text-2xl" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full">
                <div className="w-full p-5 rounded shadow bg-white flex-1">
                    <h1 className="text-2xl font-bold">Total Trips</h1>
                    <h1 className="text-xl">{originalData?.length ?? 0}</h1>
                </div>
                <div className="w-full p-5 rounded shadow bg-white flex-1">
                    <h1 className="text-2xl font-bold">Total Distance Travelled</h1>
                    <h1 className="text-xl">{loading ? "Loading..." : getTotalDistance(userData as UserInterface)}</h1>
                </div>
            </div>

            <div className="flex items-center justify-end mt-5">
                <select
                    className="mr-5"
                    onChange={(e) => {
                        setSelectedYear(e.target.value);
                    }}
                >
                    {yearsForDropdown.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                <select className="mr-5" onChange={(e) => setSelectedMonth(e.target.value)}>
                    {monthsForDropdown.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
                <button type="button" className="btn btn-primary w-24" onClick={handleExport}>
                    Export
                </button>
            </div>

            <CustomTable
                cols={columns as any}
                data={displayData}
                tableKey={new Date().getTime().toString() as any}
                limit={lLimit}
                total={total}
                currentPage={page}
                onPerPageChange={onLimitChange}
                onPageNumClick={onPageNumClick}
                onNextOrPrevious={onNextOrPrevious}
                totalPages={totalPages}
                error={error}
                loading={loading}
            />
        </div>
    );
};

export default Trips;
