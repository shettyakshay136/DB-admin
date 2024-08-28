import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, query, deleteDoc } from "firebase/firestore";
import CustomTable from "../../component/table/CustomTable";
import { db } from "../../firebaseConfig";
import { TripsResponse, UserInterface } from "./types";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import DeleteModal from "../../component/modal/DeleteModal";

const Users = () => {
    const navigate = useNavigate();

    const [originalData, setOriginalData] = useState<UserInterface[]>([]);
    const [displayData, setDisplayData] = useState<UserInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [lLimit, setlLimit] = useState(10);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [page, lLimit]);

    useEffect(() => {
        if (originalData.length > 0) {
            updateDisplayData();
        }
    }, [page, lLimit, originalData]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const usersCollectionRef = collection(db, "User");
            const q = query(usersCollectionRef);

            const querySnapshot = await getDocs(q);
            const userData: UserInterface[] = [];

            querySnapshot.forEach((doc) => {
                const userDataItem = doc.data() as UserInterface;
                userData.push(userDataItem);
            });

            await Promise.all(
                userData.map(async (user) => {
                    const userDocRef = doc(db, "User", user.uid.toString());
                    const tripsCollectionRef = collection(userDocRef, "trips");
                    const tripsSnapshot = await getDocs(tripsCollectionRef);
                    const tripsData = tripsSnapshot.docs.map((doc) => doc.data());
                    user.trips = tripsData as TripsResponse[];
                })
            );

            setTotal(userData.length);
            setOriginalData(userData);
            setLoading(false);
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
        return Math.ceil(originalData.length / lLimit) || 1;
    }, [originalData, lLimit]);

    const onPageNumClick = (currPageNum: number) => {
        setPage(currPageNum);
    };

    const onNextOrPrevious = (change: number = 1) => {
        setPage(page + change);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleteLoading(true);
        await deleteDoc(doc(db, "User", deleteId.toString()));
        await fetchData();
        setDeleteId(null);
        setDeleteLoading(false);
    };

    const columns = [
        {
            title: "#",
            key: "userId",
            render: (_: UserInterface, srNo: number) => {
                return <span>{srNo}</span>;
            },
        },
        {
            title: "NAME",
            key: "name",
            render: (record: UserInterface) => {
                return <span>{record.userName}</span>;
            },
        },
        {
            title: "EMAIL",
            key: "email",
            render: (record: UserInterface) => {
                return <span>{record.email}</span>;
            },
        },
        {
            title: "EMPLOYEE ID",
            key: "employeeId",
            render: (record: UserInterface) => {
                return <span>{record.employId}</span>;
            },
        },
        {
            title: "Total Trips",
            key: "totalTrips",
            render: (record: UserInterface) => {
                return <span>{record.trips?.length ?? 0}</span>;
            },
        },
        {
            title: "Distance Travelled",
            key: "distanceTravelled",
            render: (record: UserInterface) => {
                const regex = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?:\s*(km|m))?/gi;

                const distance = record.trips?.reduce((total, trip) => {
                    const matched = trip.distance.match(regex);
                    if (matched) {
                        const tripDistance = matched.map((match) => Number(match.replace(/[^0-9.]/g, ""))).reduce((a, b) => a + b, 0);
                        return total + tripDistance;
                    }
                    return total;
                }, 0);

                return <span>{distance + " km"}</span>;
            },
        },
        {
            title: "Action",
            key: "action",
            render: (record: UserInterface) => {
                return (
                    <div className="flex items-center justify-center">
                        <span className="cursor-pointer">
                            <FaEye className="text-blue-500 m-auto" onClick={() => navigate(`/users/trips/${record.uid}`)} />
                        </span>
                        <span className="cursor-pointer ml-3">
                            <FaTrash className="text-red-500 m-auto" onClick={() => setDeleteId(record.uid)} />
                        </span>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="grid grid-cols-12 gap-6 mt-5">
            <CustomTable
                cols={columns}
                data={displayData}
                tableKey={"uid"}
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

            <DeleteModal
                handleCancel={() => setDeleteId(null)}
                isOpen={deleteId !== null}
                loading={deleteLoading}
                onDelete={handleDelete}
                subTitle="Are you sure you want to delete this user? It will cause loss of data"
            />
        </div>
    );
};

export default Users;
