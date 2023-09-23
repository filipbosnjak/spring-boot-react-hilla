import User from "Frontend/generated/com/example/application/entity/User";

export interface HeadCell {
    disablePadding: boolean;
    id: keyof User;
    label: string;
    numeric: boolean;
}

export const headCells: readonly HeadCell[] = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'Id',
    },
    {
        id: 'username',
        numeric: true,
        disablePadding: false,
        label: 'Username',
    },
    {
        id: 'email',
        numeric: true,
        disablePadding: false,
        label: 'Email',
    }
];