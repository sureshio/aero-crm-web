import Dashboard from "../views/Dashboard/Dashboard";
import Task from "../views/Task/Task.jsx";
import TaskList from "../views/Task/TaskList.jsx";
import Setting from "../views/Setting/Setting.jsx";

const sideBar = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "pe-7s-graph",
      component: Dashboard
    },
    {
      path: "/task",
      name: "Task",
      icon: "pe-7s-gym",
      component: Task
    },
    {
      path: "/list",
      name: "View Tasks",
      icon: "pe-7s-menu",
      component: TaskList
    },
    {
      path: "/payment-list",
      name: "Payment",
      icon: "pe-7s-cash",
      component: TaskList
    },
    {
      path: "/setting",
      name: "Setting",
      icon: "pe-7s-config",
      component: Setting
    }
]

export default sideBar;