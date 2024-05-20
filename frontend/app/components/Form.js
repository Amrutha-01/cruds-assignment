"use client";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";
// import { useDispatch } from "react-redux";
import { setTableData } from "@/redux/tableDataSlice";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

const Form = ({
  onClose,
  onOpen,
  onSave,
  setOnSave,
  editingRow,
  setEditingRow,
}) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    phNo: yup.string().required("Phone number is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    hobbies: yup.string(),
  });

  // useFormik hook to manage form state and validation
  const formik = useFormik({
    initialValues: {
      sno: editingRow ? editingRow.sno : 1,
      name: editingRow ? editingRow.name : "",
      phNo: editingRow ? editingRow.phNo : "",
      email: editingRow ? editingRow.email : "",
      hobbies: editingRow ? editingRow.hobbies : "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      onClose(true);
      setOnSave(true);
      if (editingRow) {
        onOpen("open");
        await axios.put(
          `http://localhost:5002/api/users/${editingRow._id}`,
          values
        );
        const response = await axios.get("http://localhost:5002/api/getUsers");
        setTableData(response.data.users);
        setEditingRow(null);
      } else {
        await axios
          .get("https://cruds-assignment.onrender.com/api/getUsers")
          .then((res) => addUser(values, res.data.users.length))
          .catch((err) => console.log(err));
      }
      formik.resetForm();
    },
  });

  // const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);

  const addUser = async (values, length) => {
    await axios
      .post("https://cruds-assignment.onrender.com/api/addUser", {
        ...values,
        sno: length + 1,
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col justify-center items-center"
    >
      <div>
        <div className="input-boxes flex flex-col justify-center items-center">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border  border-black rounded-md m-4 p-2"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <span style={{ color: "red" }}>{formik.errors.name}</span>
          )}
        </div>
      </div>
      <div>
        <div className="input-boxes flex flex-col justify-center items-center">
          <input
            type="text"
            name="phNo"
            className="border  border-black rounded-md m-4 p-2"
            placeholder="Phone Number"
            value={formik.values.phNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phNo && formik.errors.phNo && (
            <span style={{ color: "red" }}>{formik.errors.phNo}</span>
          )}
        </div>
      </div>
      <div>
        <div className="input-boxes flex flex-col justify-center items-center">
          <input
            type="email"
            name="email"
            className="border  border-black rounded-md m-4 p-2"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <span style={{ color: "red" }}>{formik.errors.email}</span>
          )}
        </div>
      </div>
      <div>
        <div className="input-boxes flex flex-col justify-center items-center">
          <input
            type="text"
            placeholder="Hobbies"
            className="border  border-black rounded-md m-4 p-2"
            name="hobbies"
            value={formik.values.hobbies}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={!formik.isValid}
          className="bg-black text-white rounded-lg px-6 py-2"
        >
          {editingRow ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default Form;
