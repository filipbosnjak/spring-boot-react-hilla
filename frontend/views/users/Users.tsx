import { Button } from '@hilla/react-components/Button.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { TextField } from '@hilla/react-components/TextField.js';
import {HelloWorldService, UserController} from 'Frontend/generated/endpoints.js';
import { useState } from 'react';
import {getAllUsers} from "Frontend/generated/UserController";
import User from "Frontend/generated/com/example/application/entity/User";
import {set} from "@polymer/polymer/lib/utils/path";
import {GridColumn} from "@hilla/react-components/GridColumn";
import {Grid} from "@hilla/react-components/Grid";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {Dialog} from "@hilla/react-components/Dialog";

export default function Users() {
    const [users, setUsers] = useState<(User | undefined)[]>()
    const [selectedUser, setSelectedUser] = useState<(User | undefined)[]>()
    const [dialogOpened, setDialogOpened] = useState<boolean>(false)
    const handleGetAllUsers = async () => {
        const allUsers = await UserController.getAllUsers()
        setUsers(allUsers)
        console.log(allUsers)
    }

    return (
        <>
            <Button onClick={() => {
                console.log("asd")
                setDialogOpened(true)
            }}>Add user</Button>
            <Button onClick={handleGetAllUsers}>Get All Users</Button>
            <Grid
                items={users}
                selectedItems={selectedUser}
                onActiveItemChanged={(e) => {
                    const item = e.detail.value;
                    setSelectedUser(item ? [item] : []);
                }}
            >
                <GridColumn path="id" />
                <GridColumn path="username" />
                <GridColumn path="email" />
            </Grid>

            <Dialog
                headerTitle="New user"
                opened={dialogOpened}
                onOpenedChanged={({ detail }) => {
                    setDialogOpened(detail.value);
                }}
                footerRenderer={() => (
                    <>
                        <Button onClick={() => setDialogOpened(false)}>Cancel</Button>
                        <Button theme="primary" onClick={() =>

                            setDialogOpened(false)}>
                            Add
                        </Button>
                    </>
                )}
            >
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <TextField label="Username" />
                    <TextField label="Email" />
                </VerticalLayout>
            </Dialog>

        </>
    );
}