import "../assets/css/loading.css";

export interface LoadingParams {
    forTable?: boolean;
    isButton?: boolean;
}

const Loading = ({ forTable = true, isButton }: LoadingParams) => {
    return (
        <>
            {isButton ? (
                <div className="lds-ellipsis isButton h-[20px] w-[100px] relative">
                    <div className="top-1"></div>
                    <div className="top-1"></div>
                    <div className="top-1"></div>
                    <div className="top-1"></div>
                </div>
            ) : (
                <div className={`loading-container ${forTable && "min-height-300"}`}>
                    <div className="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Loading;
