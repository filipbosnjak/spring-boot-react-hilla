import { Button as HButton } from '@hilla/react-components/Button.js';
import { TextField as HTextFiled } from '@hilla/react-components/TextField.js';
import {UserController} from 'Frontend/generated/endpoints.js';
import {useEffect, useMemo, useState} from 'react';
import User from "Frontend/generated/com/example/application/entity/User";
import {GridColumn} from "@hilla/react-components/GridColumn";
import {Grid} from "@hilla/react-components/Grid";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {Dialog as HDialog} from "@hilla/react-components/Dialog";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {DialogTitle} from "@mui/material";
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import {getComparator, Order, stableSort} from "Frontend/sorting/SortingUtils";



interface HeadCell {
    disablePadding: boolean;
    id: keyof User;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
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

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof User) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

export default function Users() {
    const [users, setUsers] = useState<(User | undefined)[]>()
    const [selectedUser, setSelectedUser] = useState<(User | undefined)[]>()
    const [updateD, setUpdateD] = useState<boolean>(false)
    const [createD, setCreateD] = useState<boolean>(false)
    const [newUser, setNewUser] = useState<User | undefined>()

    const [str, setStr ] = useState<string>()

    const [open, setOpen] = useState(false);

    const [muiDialog, setMuiDialog] = useState<string>("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSave = () => {
        console.log(newUser)
        setOpen(false)
        UserController.saveUser(newUser).then(res => {
            console.log(res)
            return handleGetAllUsers()
        })
        handleGetAllUsers().then(res => console.log(res))
    };
    const handleGetAllUsers = async () => {
        const allUsers = await UserController.getAllUsers()
        setUsers(allUsers)
    }

    useEffect(() => {
        handleGetAllUsers().then(res => console.log(res))
    }, [])

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('username');
    const [selected, setSelected] = useState<readonly string[]>([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof User,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (users?.length || 0)) : 0;

    const visibleRows = useMemo(
        () =>
            users && stableSort(users, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, users],
    );

    return (
        <>
            <Button onClick={() => {
                handleClickOpen()
            }} style={{
                margin: "10px"
            }}>Add user</Button>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={users?.length || 0}
                            />
                            <TableBody>
                                {visibleRows?.map((user, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                           /* onClick={(event) => handleClick(event, user?.username)}*/
                                            tabIndex={-1}
                                            key={user?.id}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {user?.id}
                                            </TableCell>
                                            <TableCell align="right">{user?.username}</TableCell>
                                            <TableCell align="right">{user?.email}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={users?.length || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />
            </Box>

            <HDialog
                headerTitle="New user"
                opened={createD}
                onOpenedChanged={({ detail }) => {
                    if(!detail.value) {
                        setNewUser(undefined)
                    }
                    setCreateD(detail.value);
                }}
                footerRenderer={() => (
                    <>
                        <Button onClick={() => {
                            setCreateD(false)
                        }}>Cancel</Button>
                        <HButton theme="primary" onClick={(e) => {
                            setCreateD(curr => !curr)
                            console.log(newUser)

                        }}>
                            Add
                        </HButton>
                    </>
                )}
            >
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <HTextFiled label="Username" value={newUser ? newUser?.username : "" } onChange={(e) => {
                        const u: User = {
                            ...newUser,
                            username: e.target.value
                        }
                        setNewUser(u)
                    }}/>
                    <HTextFiled label="Email" value={newUser ? newUser?.email : "" }  onChange={(e) => {
                        const u: User = {
                            ...newUser,
                            email: e.target.value
                        }
                        setNewUser(u)
                    }} />
                </VerticalLayout>
            </HDialog>

            <HDialog
                headerTitle="Update user"
                opened={updateD}
                onOpenedChanged={({ detail }) => {
                    if(!detail.value) {
                        setSelectedUser(undefined)
                    }
                    setUpdateD(detail.value);
                    console.log(selectedUser)
                }}
                footerRenderer={() => (
                    <>
                        <Button onClick={() => {
                            setUpdateD(false)
                        }}>Cancel</Button>
                        <HButton theme="primary" onClick={() => {
                            setUpdateD(false)
                            console.log(selectedUser)
                            if (selectedUser) {
                                UserController.updateUser(selectedUser[0]).then(res => {
                                    console.log(res)
                                    return handleGetAllUsers()
                                })

                            }
                        }}>
                            Update
                        </HButton>
                        <HButton theme="primary error" onClick={() => {
                            setUpdateD(false)
                            if (selectedUser) {
                                UserController.deleteUser(selectedUser[0]).then(res => {
                                    console.log(res)
                                    return handleGetAllUsers()
                                })

                            }
                        }}>
                            Delete
                        </HButton>
                    </>
                )}
            >
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <TextField label="Username" value={selectedUser ? selectedUser[0]?.username : "" } onChange={(e) => {
                        const u: User = {
                            ...selectedUser,
                            username: e.target.value
                        }
                        setSelectedUser([u])
                    }} />
                    <HTextFiled label="Email" value={selectedUser ? selectedUser[0]?.email : "" } onChange={(e) => {
                        const u: User = {
                            ...selectedUser,
                            email: e.target.value
                        }
                        setSelectedUser([u])
                    }}  />
                </VerticalLayout>
            </HDialog>

            <HTextFiled label="Str" value={str} onChange={(e) => {
                console.log("change")
                setStr(prevState =>  e.target.value)
            }} />
            <input value={str} onChange={(e) => {
                console.log("change")
                setStr(prevState =>  e.target.value)
            }} />
            <div>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Open form dialog
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Create new user</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus={true}
                            margin="dense"
                            id="name"
                            label="Username"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={newUser?.username}
                            onChange={(e) => {
                                setNewUser({
                                    ...newUser,
                                    username: e.target.value
                                })
                            }}
                        />
                        <TextField
                            autoFocus={true}
                            margin="dense"
                            id="name"
                            label="Email"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={newUser?.email}
                            onChange={(e) => {
                                setNewUser({
                                    ...newUser,
                                    email: e.target.value
                                })
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}