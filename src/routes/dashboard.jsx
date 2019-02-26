import Dashboard from "../views/Dashboard/Dashboard";
import MemberComponent from "../views/Member/MemberComponent";
import MemberAddComponent from "../views/Member/MemberAddComponent";
import Task from "../views/Task/Task";
import TaskList from "../views/Task/TaskList";
import Login from '../login';
import SignUp from '../signup';
import ForgotUsername from '../forgot-username';
import ForgotPassword from '../forgot-password';
import ChangePassword from '../change-password';
import PaymentList from '../views/Payment/PaymentList.jsx';
import Setting from "../views/Setting/Setting.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    component: Dashboard
  },
  {
    path: "/member/:id",
    component: MemberComponent
  },
  {
    path: "/add/member",
    component: MemberAddComponent
  },
  {
    path: "/task",
    component: Task
  },
  {
    path: "/list",
    component: TaskList
  },
  {
    path: "/payment-list",
    component: PaymentList
  },
  {
    path: "/setting",
    component: Setting
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/signup",
    component: SignUp
  },
  {
    path: "/forgot-username",
    component: ForgotUsername
  },
  {
    path: "/forgot-password",
    component: ForgotPassword
  },
  {
    path: "/pwd-change/:token",
    component: ChangePassword
  },
  { redirect: true, path: "/", to: "/login", name: "Login" }
];

export default dashboardRoutes;
