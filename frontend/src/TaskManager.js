import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from "./api";
import { notify } from "./utils";
function TaskManager() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [copyTasks, setCopyTasks] = useState([]);
  const [updateTask, setUpdateTask] = useState(null);

  const handleTask = () => {
    if (updateTask && input) {
      //upadte api call
      console.log("update api call");
      const obj = {
        taskName: input,
        isDone: updateTask.isDone,
        _id: updateTask._id,
      };
      handleUpdateItem(obj);
    } else if (updateTask === null && input) {
      console.log("create api call");
      //create api call
      handleAddTask();
    }
    setInput("");
  };

  useEffect(() => {
    if (updateTask) {
      setInput(updateTask.taskName);
    }
  }, [updateTask]);

  const handleAddTask = async () => {
    const obj = {
      taskName: input,
      isDone: false,
    };
    try {
      const { success, message } = await CreateTask(obj);
      if (success) {
        //show success toast
        notify(message, "success");
      } else {
        //show error toast
        notify(message, "error");
      }
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to create task", "error");
    }
  };

  const fetchAllTasks = async () => {
    try {
      const { data } = await GetAllTasks();
      setTasks(data);
      setCopyTasks(data);
    } catch (err) {
      console.error(err);
      notify("Failed to create task", "error");
    }
  };
  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleDeleteTask = async (id) => {
    try {
      const { success, message } = await DeleteTaskById(id);
      if (success) {
        //show success toast
        notify(message, "success");
      } else {
        //show error toast
        notify(message, "error");
      }
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to create task", "error");
    }
  };

  const handleCheckAndUncheck = async (item) => {
    const { _id, isDone, taskName } = item;
    const obj = {
      taskName,
      isDone: !isDone,
    };
    try {
      const { success, message } = await UpdateTaskById(_id, obj);
      if (success) {
        //show success toast
        notify(message, "success");
      } else {
        //show error toast
        notify(message, "error");
      }
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to create task", "error");
    }
  };

  const handleUpdateItem = async (item) => {
    const { _id, isDone, taskName } = item;
    const obj = {
      taskName,
      isDone: isDone,
    };
    try {
      const { success, message } = await UpdateTaskById(_id, obj);
      if (success) {
        //show success toast
        notify(message, "success");
      } else {
        //show error toast
        notify(message, "error");
      }
      fetchAllTasks();
    } catch (err) {
      console.error(err);
      notify("Failed to create task", "error");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const oldTasks = [...copyTasks];
    const results = oldTasks.filter((item) =>
      item.taskName.toLowerCase().includes(term)
    );
    setTasks(results);
  };
  return (
    <div className="container my-5">
      <div className="card p-5 shadow-lg border-0 rounded-4">
        <h1 className="text-center mb-4 fw-bold text-primary display-6">
          ✅ Task Manager App
        </h1>

        {/* Input + Search */}
        <div className="row g-3 mb-4">
          {/* Add Task */}
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="form-control form-control-lg"
                placeholder="📝 Add a new task..."
              />
              <button onClick={handleTask} className="btn btn-success btn-lg">
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaSearch />
              </span>
              <input
                onChange={handleSearch}
                className="form-control form-control-lg"
                type="text"
                placeholder="🔍 Search tasks..."
              />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="d-flex flex-column gap-3">
          {tasks?.length > 0 ? (
            tasks.map((item) => (
              <div
                key={item._id}
                className="p-3 rounded-4 shadow-sm d-flex justify-content-between align-items-center task-item bg-light"
              >
                <span
                  className={`fs-5 ${
                    item.isDone
                      ? "text-decoration-line-through text-muted"
                      : "text-dark"
                  }`}
                >
                  {item.taskName}
                </span>

                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleCheckAndUncheck(item)}
                    className="btn btn-outline-success btn-sm rounded-circle"
                    title="Mark as Done/Undone"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => setUpdateTask(item)}
                    className="btn btn-outline-primary btn-sm rounded-circle"
                    title="Edit Task"
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(item._id)}
                    className="btn btn-outline-danger btn-sm rounded-circle"
                    title="Delete Task"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info text-center fw-semibold">
              No tasks available. Add a new one!
            </div>
          )}
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
      </div>
    </div>
  );
}

export default TaskManager;
