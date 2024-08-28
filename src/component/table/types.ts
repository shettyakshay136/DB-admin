export interface ColumnParams<T> {
    key: string;
    sortable?: boolean;
    title?: string;
    render: (record: T, index: number) => JSX.Element;
    align?: Alignment;
    minWidth?: boolean;
    titleRender?: () => JSX.Element;
}

export interface TableProps<T> {
    cols: ColumnParams<T>[];
    data: T[] | null;
    tableKey: keyof T;
    loading?: boolean;
    total?: number;
    currentPage: number;
    component?: JSX.Element;
    limit: number;
    onPerPageChange: (limit: number) => void;
    totalPages: number;
    onNextOrPrevious: (change?: number) => void;
    error?: string | null;
    onPageNumClick: (pageNum: number) => void;
    fieldName?: string | null;
    order?: string | null;
    onSortClick?: (orderBy: string) => void;
    className?: string;
    tableFooter?: boolean;
}

export enum Alignment {
    RIGHT = "right",
    LEFT = "left",
    CENTER = "center",
}
