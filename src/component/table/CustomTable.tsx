import Loading from "../../container/Loading";
import { useEffect, useState } from "react";
import { GoAlert } from "react-icons/go";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { ColumnParams, TableProps } from "./types";
import { ONE } from "../../helper/constant";

const CustomTable = <T,>({
    cols,
    data,
    tableKey,
    loading,
    error,
    currentPage,
    limit,
    order,
    component,
    fieldName,
    onSortClick,
    totalPages,
    onPerPageChange,
    total,
    onNextOrPrevious,
    onPageNumClick,
}: TableProps<T>) => {
    const [pagination, setPagination] = useState<number[]>([currentPage]);

    useEffect(() => {
        if (!pagination.includes(currentPage)) {
            setPagination([currentPage]);
        } else {
            const maxLimit = 3;
            let startPage = Math.max(1, currentPage - maxLimit);
            let endPage = Math.min(totalPages, currentPage + maxLimit);

            if (endPage - startPage < maxLimit * 2) {
                if (currentPage <= maxLimit) {
                    endPage = Math.min(totalPages, maxLimit * 2 + 1);
                } else {
                    startPage = Math.max(1, totalPages - maxLimit * 2);
                }
            }

            setPagination([...Array(endPage - startPage + 1)].map((_, i) => startPage + i));
        }
    }, [currentPage, totalPages, total, limit]);

    return (
        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
            <div className="intro-y box p-5 mt-5">
                <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">{component}</div>
                <div
                    id="tabulator"
                    className="mt-5 table-report table-report--tabulator tabulator"
                    tabulator-layout="fitColumns"
                    style={{ overflow: "auto" }}
                >
                    {loading && error === null ? (
                        <Loading />
                    ) : error !== null ? (
                        <div className="alert alert-danger mt-6 show flex items-center mb-2" role="alert">
                            <GoAlert className="w-6 h-6 mr-2" /> {error}
                        </div>
                    ) : data?.length === 0 ? (
                        <div className="box py-10 sm:py-20 mt-5">
                            <div className="font-medium text-center text-lg">No data found</div>
                        </div>
                    ) : (
                        <>
                            <table className="table sm:mt-2">
                                <thead>
                                    <tr>
                                        <>
                                            {cols.map((data: ColumnParams<T>, i: number) => (
                                                <th
                                                    className={`${data.sortable && "cursor-pointer"} ${
                                                        i !== 0 ? "table-col-custom text-center" : ""
                                                    } ${data.align ? `text-${data.align}` : ""}`}
                                                    key={data.key}
                                                    onClick={() => (data.sortable ? onSortClick && onSortClick(data.key) : "")}
                                                >
                                                    <div className="tabulator-col-content">
                                                        <div className="tabulator-col-title-holder">
                                                            <div className="tabulator-col-title">{data.title}</div>
                                                        </div>
                                                        {data.sortable ? (
                                                            <div className="tabulator-col-sorter" style={{ right: -3 }}>
                                                                <div
                                                                    className={
                                                                        fieldName === data.key
                                                                            ? order === "ASC"
                                                                                ? "arrow-active-asc"
                                                                                : "arrow-active-desc"
                                                                            : "tabulator-arrow"
                                                                    }
                                                                ></div>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </th>
                                            ))}
                                        </>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((data: T, index: number) => (
                                        <tr key={data[tableKey] as string}>
                                            {cols.map((col, key) => (
                                                <td key={key} className={`whitespace-nowrap ${key !== 0 ? "text-center" : "font-medium"}`}>
                                                    {col.render(data, limit * (currentPage - 1) + index + 1)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="tabulator-footer">
                                <span className="tabulator-paginator" style={{ display: "flex", flexDirection: "row" }}>
                                    <label>Page Size</label>
                                    <select
                                        className="tabulator-page-size"
                                        aria-label="Page Size"
                                        title="Page Size"
                                        defaultValue={limit}
                                        onChange={(e) => onPerPageChange(+e.target.value)}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                        <option value={40}>40</option>
                                    </select>

                                    <div className="hidden md:block mx-auto text-slate-500">
                                        Total {total} {total === 1 ? "record" : "records"}
                                    </div>

                                    <div className="flex items-center">
                                        <button
                                            className="tabulator-page page-link"
                                            disabled={currentPage - 1 <= 0}
                                            onClick={() => onNextOrPrevious(-ONE)}
                                        >
                                            <FaAngleLeft className="w-4 h-4" />
                                        </button>
                                        {pagination.map((i) => (
                                            <button
                                                className={`tabulator-page page-link ${currentPage === i && "active"}`}
                                                key={i}
                                                onClick={() => onPageNumClick(i)}
                                            >
                                                {i}
                                            </button>
                                        ))}
                                        <button
                                            className="tabulator-page page-link"
                                            disabled={totalPages <= currentPage}
                                            onClick={() => onNextOrPrevious(ONE)}
                                        >
                                            <FaAngleRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomTable;
