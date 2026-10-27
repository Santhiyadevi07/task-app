import React from "react";

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: [],
            taskname: '',
            taskstatus: false,
            editid: null,
        };
    }

    componentDidMount() {
        this.readData();
    }

    handleCreate = async () => {
        try {
            await fetch('http://localhost:8000/task/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: this.state.taskname,
                    completed: this.state.taskstatus,
                }),
            });
            this.readData();
        } catch (error) {
            console.error('Error creating item', error);
        }
    };

    handleEdit = (id) => {
        const selecteditem = this.state.values.find(item => item.id === id);
        console.log(id);
        console.log(selecteditem);
        if (selecteditem) {
            this.setState({
                taskname: selecteditem.title,
                taskstatus: selecteditem.completed,
                editid: id,
            });
        }
    };

    readData = async () => {
        fetch('http://localhost:8000/task')
            .then((res) => res.json())
            .then((data) => this.setState({ values: data }));
    };

    handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:8000/task/${id}/`, {
                method: 'DELETE',
            });
            this.readData();
        } catch (error) {
            console.error('Error deleting item', error);
        }
    };

    handleUpdate = async () => {
        const { editid, taskname, taskstatus } = this.state;
        if (editid) {
            try {
                await fetch(`http://localhost:8000/task/${editid}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: taskname,
                        completed: taskstatus,
                    }),
                });
                this.setState({ taskname: '', taskstatus: false, editid: null });
                this.readData();
            } catch (error) {
                console.error('Error updating item', error);
            }
        }
    };

    render() {
        return (
            <div>
                <h1>Task App</h1>
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td colSpan={3}><h2>Create Item</h2></td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Task Name"
                                        value={this.state.taskname}
                                        onChange={(e) => this.setState({ taskname: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={this.state.taskstatus}
                                        onChange={(e) => this.setState({ taskstatus: e.target.checked })}
                                    />
                                </td>
                                <td>
                                    {this.state.editid ? (
                                        <button type="button" onClick={this.handleUpdate}>Update</button>
                                    ) : (
                                        <button type="button" onClick={this.handleCreate}>Create</button>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <h2>The following are tasks</h2>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={4}>Task Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.values.map((item) => (
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>{item.completed ? "Completed" : "Pending"}</td>
                                <td>
                                    <button onClick={() => this.handleEdit(item.id)}>Edit</button>
                                </td>
                                <td>
                                    <button onClick={() => this.handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default Task;