import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink  } from "@apollo/client";
import { BrowserRouter, Route,Routes} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NoPage from "./pages/NoPage";
import Students from "./pages/Students";
//import AddStudent from "./pages/AddStudent";
import AddCourse from "./pages/AddCourse";
import Courses from "./pages/Courses";
//import StudentProfile from "./pages/StudentProfile";
import CourseProfile from "./pages/CourseProfile";
import { setContext } from "@apollo/client/link/context";

function merge(existing: any[] = [], incoming: any[]) {
  if (existing.length > 0) {
    const merged = [...existing];

    // Add incoming items that don't exist in the existing array
    incoming.forEach(incomingItem => {
      const foundIncomingItemWithinExisting = existing.some(existingItem => existingItem.__ref === incomingItem.__ref);
      if (!foundIncomingItemWithinExisting) {
        merged.push(incomingItem);
      }
    });

    return merged;
  } else {
    return incoming;
  }
}


const client = new ApolloClient({
  link: setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: sessionStorage.getItem("AccessToken")
      },
    }
  }).concat(createHttpLink({
    uri: "http://155.248.246.152:8081/graphql",
  })),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          GetStudents: {
            keyArgs: [], // Don't merge when these fields are changed
            merge,
          },
          GetCorses: {
            keyArgs: [], // Don't merge when these fields are changed
            merge,
          }
        }
      }
    }
    
  })
});

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Dashboard",
    element: <Dashboard />,
  },
  {
    path: "/Students",
    element: <Students/>,
  },
  // {
  //   path: "/AddStudent",
  //   element: <AddStudent />,
  // },
  {
    path: "/Courses",
    element: <Courses />,
  },
  {
    path: "/AddCourse",
    element: <AddCourse />,
  },
  // {
  //   path: "/Students/:studentId",
  //   element: <StudentProfile />,
  // },
  {
    path: "/Courses/:courseId",
    element: <CourseProfile/>,
  },
  {
    path: "*",
    element: <NoPage />,
  },
];

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);

reportWebVitals();



/*
https://www.google.com/students GET POST
https://www.google.com/students/:studentId GET PATCH DELETE
https://www.srilanka.com/provinces
https://www.srilanka.com/provinces/:provinceId
https://www.srilanka.com/provinces/:provinceId/districts
https://www.srilanka.com/provinces/:provinceId/districts/:districtId

https://www.myclass.com/courses/
https://www.myclass.com/users/@me
*/


