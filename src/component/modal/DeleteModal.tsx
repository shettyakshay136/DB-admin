import Modal from "./Modal";
import Loading from "../../container/Loading";

interface Props {
    isOpen: boolean;
    onDelete: () => void;
    handleCancel: () => void;
    subTitle: string;
    loading: boolean;
}

const DeleteModal = ({ isOpen, handleCancel, onDelete, subTitle, loading }: Props) => {
    return (
        <Modal isOpen={isOpen}>
            <>
                {loading ? (
                    <Loading forTable={false} />
                ) : (
                    <>
                        <div className="p-5 text-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                icon-name="x-circle"
                                data-lucide="x-circle"
                                className="lucide lucide-x-circle w-16 h-16 text-danger mx-auto mt-3"
                            >
                                <circle cx={12} cy={12} r={10} />
                                <line x1={15} y1={9} x2={9} y2={15} />
                                <line x1={9} y1={9} x2={15} y2={15} />
                            </svg>
                            <div className="text-3xl mt-5">Are you sure?</div>
                            <div className="text-slate-500 mt-2">
                                {subTitle}
                                <br />
                                This process cannot be undone.
                            </div>
                        </div>
                        <div className="px-5 pb-8 text-center">
                            <button
                                type="button"
                                data-tw-dismiss="modal"
                                className="btn btn-outline-secondary w-24 mr-3"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger w-24" onClick={() => onDelete()}>
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </>
        </Modal>
    );
};

export default DeleteModal;
