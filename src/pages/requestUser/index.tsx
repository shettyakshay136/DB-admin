import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, query, setDoc } from "firebase/firestore";
import CustomTable from "../../component/table/CustomTable";
import { auth, db } from "../../firebaseConfig";
import { RequestUser } from "./types";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { generatePassword } from "../../utils";
import toast, { LoaderIcon } from "react-hot-toast";

const RequestUsers = () => {
    const [originalData, setOriginalData] = useState<RequestUser[]>([]);
    const [displayData, setDisplayData] = useState<RequestUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [approveLoading, setApprovedLoading] = useState(false);
    const [approveUserId, setApproveUserId] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [lLimit, setlLimit] = useState(10);

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
            const usersCollectionRef = collection(db, "requestUser");
            const q = query(usersCollectionRef);

            const querySnapshot = await getDocs(q);
            const userData: RequestUser[] = [];

            querySnapshot.forEach((doc) => {
                const userDataItem = doc.data() as RequestUser;
                userData.push(userDataItem);
            });

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

    const onApprove = async (record: RequestUser) => {
        setApprovedLoading(true);
        setApproveUserId(record.employId);

        try {
            const password = generatePassword();
            const userCredential = await createUserWithEmailAndPassword(auth, record.email, password);

            const user = userCredential.user;
            if (user) {
                const adminDocRef = doc(db, "User", user.uid);
                await setDoc(adminDocRef, {
                    userName: record.userName,
                    email: record.email,
                    employId: record.employId,
                    uid: user.uid,
                });
                toast.success("User approved successfully");

                const querySnapshot = await getDocs(collection(db, "requestUser"));

                const requestUser = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as RequestUser[];

                const filteredUser = requestUser?.filter((item) => item.email === record.email);
                filteredUser?.forEach(async (item) => {
                    const requestUserDocRef = doc(db, "requestUser", item.id?.toString() || "");
                    await deleteDoc(requestUserDocRef);
                });

                await fetch(`https://offers.earnpati.com/v1/auth/test-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: record.email,
                        subject: "I-Ride Account Approved",
                        text: `Your account has been approved. Your login credentials are: \n Email: ${record.email} \n Password: ${password}`,
                    }),
                });

                fetchData();
            }
        } catch (error: any) {
            const message = error.code.split("/")[1];
            toast.error(message);
        } finally {
            setApprovedLoading(false);
        }
    };

    const columns = [
        {
            title: "#",
            key: "userId",
            render: (_: RequestUser, srNo: number) => {
                return <span>{srNo}</span>;
            },
        },
        {
            title: "NAME",
            key: "name",
            render: (record: RequestUser) => {
                return <span>{record.userName}</span>;
            },
        },
        {
            title: "EMAIL",
            key: "email",
            render: (record: RequestUser) => {
                return <span>{record.email}</span>;
            },
        },
        {
            title: "EMPLOYEE ID",
            key: "employeeId",
            render: (record: RequestUser) => {
                return <span>{record.employId}</span>;
            },
        },
        {
            title: "ACTION",
            key: "action",
            render: (record: RequestUser) => {
                return (
                    <button
                        onClick={() => onApprove(record)}
                        className="bg-blue-500 hover:bg-blue-700 text-white w-24 font-bold py-2 px-4 rounded"
                    >
                        {approveLoading && approveUserId === record.employId ? <LoaderIcon className="w-5 h-5 m-auto" /> : "Approve"}
                    </button>
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
        </div>
    );
};

export default RequestUsers;
