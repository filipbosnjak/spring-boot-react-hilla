import { Button } from '@hilla/react-components/Button.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { TextField } from '@hilla/react-components/TextField.js';
import {HelloWorldService, UserController} from 'Frontend/generated/endpoints.js';
import {useEffect, useState} from 'react';
import {getAllUsers} from "Frontend/generated/UserController";
import User from "Frontend/generated/com/example/application/entity/User";
import {set} from "@polymer/polymer/lib/utils/path";
import {GridColumn} from "@hilla/react-components/GridColumn";
import {Grid} from "@hilla/react-components/Grid";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {Dialog} from "@hilla/react-components/Dialog";
import {logger} from "workbox-core/_private";

export default function Users() {
    const [users, setUsers] = useState<(User | undefined)[]>()
    const [selectedUser, setSelectedUser] = useState<(User | undefined)[]>()
    const [updateD, setUpdateD] = useState<boolean>(false)
    const [createD, setCreateD] = useState<boolean>(false)
    const [newUser, setNewUser] = useState<User | undefined>()

    const [str, setStr ] = useState<string>()
    const handleGetAllUsers = async () => {
        const allUsers = await UserController.getAllUsers()
        setUsers(allUsers)
    }

    useEffect(() => {
        handleGetAllUsers().then(res => console.log(res))
    }, [])

    return (
        <>
            <Button onClick={() => {
                setCreateD(true)
            }} style={{
                margin: "10px"
            }}>Add user</Button>
            <Grid
                items={users}
                selectedItems={selectedUser}
                onActiveItemChanged={(e) => {
                    const item = e.detail.value;
                    console.log(item)
                    setSelectedUser(item ? [item] : []);
                    e.preventDefault()
                    setUpdateD(true)
                }}
            >
                <GridColumn path="id" />
                <GridColumn path="username" />
                <GridColumn path="email" />
            </Grid>

            <Dialog
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
                        <Button theme="primary" onClick={(e) => {
                            setCreateD(curr => !curr)
                            console.log(newUser)
                            UserController.saveUser(newUser).then(res => {
                                console.log(res)
                                 return handleGetAllUsers()
                            })

                        }}>
                            Add
                        </Button>
                    </>
                )}
            >
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <TextField label="Username" value={newUser ? newUser?.username : "" } onChange={(e) => {
                        const u: User = {
                            ...newUser,
                            username: e.target.value
                        }
                        setNewUser(u)
                    }}/>
                    <TextField label="Email" value={newUser ? newUser?.email : "" }  onChange={(e) => {
                        const u: User = {
                            ...newUser,
                            email: e.target.value
                        }
                        setNewUser(u)
                    }} />
                </VerticalLayout>
            </Dialog>

            <Dialog
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
                        <Button theme="primary" onClick={() => {
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
                        </Button>
                        <Button theme="primary error" onClick={() => {
                            setUpdateD(false)
                            if (selectedUser) {
                                UserController.deleteUser(selectedUser[0]).then(res => {
                                    console.log(res)
                                    return handleGetAllUsers()
                                })

                            }
                        }}>
                            Delete
                        </Button>
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
                    <TextField label="Email" value={selectedUser ? selectedUser[0]?.email : "" } onChange={(e) => {
                        const u: User = {
                            ...selectedUser,
                            email: e.target.value
                        }
                        setSelectedUser([u])
                    }}  />
                </VerticalLayout>
            </Dialog>

            <TextField label="Str" value={str} onChange={(e) => {
                console.log("change")
                setStr(prevState =>  e.target.value)
            }} />
            <input value={str} onChange={(e) => {
                console.log("change")
                setStr(prevState =>  e.target.value)
            }} />

        </>
    );
}