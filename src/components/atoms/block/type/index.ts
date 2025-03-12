
export interface BlockType {
    className?: string;
    size?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export interface BlockContentType {
    className?: string; 
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export interface BlockBetweenType {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export interface BlockHeadType {
    className?: string;
    wide?: string;
    size?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export interface BlockHeadContentType {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export interface BlockTitleType {
    className?: string;
    fontSize?: number;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export interface BlockDesType {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export interface BackToType {
    className?: string;
    link: string;
    icon: string | undefined;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}
