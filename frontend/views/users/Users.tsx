import { Button as HButton } from '@hilla/react-components/Button.js';
import { TextField as HTextFiled } from '@hilla/react-components/TextField.js';
import {ServerInfo, UserController} from 'Frontend/generated/endpoints.js';
import {useEffect, useMemo, useState} from 'react';
import User from "Frontend/generated/com/example/application/entity/User";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {Dialog as HDialog} from "@hilla/react-components/Dialog";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {DialogTitle} from "@mui/material";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {getComparator, Order, stableSort} from "Frontend/sorting/SortingUtils";
import Head from "Frontend/views/users/components/Head";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';

export default function Users() {
    const [users, setUsers] = useState<(User | undefined)[]>()
    const [selectedUser, setSelectedUser] = useState<User | undefined>()
    const [updateD, setUpdateD] = useState<boolean>(false)
    const [createD, setCreateD] = useState<boolean>(false)
    const [newUser, setNewUser] = useState<User | undefined>()

    const [str, setStr ] = useState<string>()

    const [openCreateD, setOpenCreateD] = useState(false);
    const [openEditD, setOpenEditD] = useState(false);

    const [port, setPort] = useState(1223)

    const handleClickOpen = () => {
        setOpenCreateD(true);
    };

    const closeCreateD = () => {
        setOpenCreateD(false);
    };
    const closeEditD = () => {
        setOpenEditD(false);
    };
    const handleCreate = async () => {
        setOpenCreateD(false)
        await UserController.saveUser(newUser)
        await handleGetAllUsers()
    };
    const handleSave = async () => {
        setOpenEditD(false)
        await UserController.updateUser(selectedUser)
        await handleGetAllUsers()
        console.log("userUp")
    };

    const handleDelete = async () => {
        setOpenEditD(false)
        await UserController.deleteUser(selectedUser)
        await handleGetAllUsers()
    }
    const handleGetAllUsers = async () => {
        const allUsers = await UserController.getAllUsers()
        setUsers(allUsers)
    }

    useEffect( () => {
        handleGetAllUsers().then(r => console.log(r))
        ServerInfo.serverPort().then(port => setPort(port || 1223))
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
            stableSort(users || [], getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, users],
    );

    return (
        <>
            <Button variant="outlined" onClick={() => {
                handleClickOpen()
            }} style={{
                margin: "10px 20px"
            }}>Add user</Button>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>

                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <Head
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
                                           onClick={(event) => {
                                               console.log(user)
                                               handleClick(event, user.username as string)
                                               setSelectedUser(user as User)
                                               setOpenEditD(true)
                                           }}
                                            tabIndex={-1}
                                            key={user?.id}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="normal"
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
            </Box>

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
                                UserController.updateUser(selectedUser).then(res => {
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
                                UserController.deleteUser(selectedUser).then(res => {
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
                    <TextField label="Username" value={selectedUser?.username} onChange={(e) => {
                        const u: User = {
                            ...selectedUser,
                            username: e.target.value
                        }
                        setSelectedUser(u)
                    }} />
                    <HTextFiled label="Email" value={selectedUser?.email} onChange={(e) => {
                        const u: User = {
                            ...selectedUser,
                            email: e.target.value
                        }
                        setSelectedUser(u)
                    }}  />
                </VerticalLayout>
            </HDialog>

            <div>
                <Dialog open={openCreateD} onClose={closeCreateD}>
                    <DialogTitle>Create new user</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus={false}
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
                            autoFocus={false}
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
                        <Button onClick={closeCreateD}>Cancel</Button>
                        <Button onClick={handleCreate}>Create</Button>
                    </DialogActions>
                </Dialog>
            </div>

            <div>
                <Dialog open={openEditD} onClose={closeEditD}>
                    <DialogTitle>Update user</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus={false}
                            margin="dense"
                            id="name"
                            label="Username"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={selectedUser?.username}
                            onChange={(e) => {
                                setSelectedUser({
                                    ...selectedUser,
                                    username: e.target.value
                                })
                            }}
                        />
                        <TextField
                            autoFocus={false}
                            margin="dense"
                            id="name"
                            label="Email"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={selectedUser?.email}
                            onChange={(e) => {
                                setSelectedUser({
                                    ...selectedUser,
                                    email: e.target.value
                                })
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button onClick={closeEditD}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <a style={{
                textDecoration: "none",
                marginLeft: "10px"
            }} href={`http://localhost:${port}/pdf-report`}>
            <Button style={{
            }} variant="outlined" value="download" onClick={()=> {
            }}>Export PDF<PictureAsPdfIcon style={{
                marginLeft: "10px"
            }}/></Button></a>
            <a style={{
            textDecoration: "none",
            marginLeft: "10px"
        }} href={`http://localhost:${port}/xlsx-report`}>
            <Button style={{
            }} variant="outlined" value="download" onClick={()=> {
            }}>Export Excel<TableViewIcon style={{
                marginLeft: "10px"
            }}/></Button></a>
        </>
    );
}