export interface ColType {
    sm?: number;
    lg?: number;
    md?: number;
    xxl?: number;
    size?: number;
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export interface RowType {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}