"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./MainPage.module.css";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import emailjs from "@emailjs/browser";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
  Portal,
  Box,
  Button,
} from "@chakra-ui/react";
import Form from "./Form";
import axios from "axios";
// import { useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";

const MainPage = () => {
  const selectedRowsRef = useRef();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [tableData, setTableData] = useState(null);
  const [onSave, setOnSave] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [filteredRows ,setFilteredRows]= useState([]);

  useEffect(() => {
    if (selectedRows && tableData) {
      setFilteredRows(tableData.filter((row) => 
      selectedRows.includes(row._id)
    ))
    }
  }, [selectedRows]);

  useEffect(() => {
    const tableInfo = async () => {
      try {
        const response = await axios.get(
          "https://cruds-assignment.onrender.com/api/getUsers"
        );
        setTableData(response.data.users);
      } catch (error) {
        console.log("Error fetching table data:", error);
      }
    };
    tableInfo();
    if (onSave) {
      setOnSave(false); // Reset onSave after fetching tableData
    }
  }, [onSave]);

  const handleRowClick = (id) => {
    const selectedIndex = selectedRows.indexOf(id);
    if (selectedIndex === -1) {
      // Row not selected, add to selectedRows
      setSelectedRows([...selectedRows, id]);
    } else {
      // Row already selected, remove from selectedRows
      const updatedSelectedRows = [...selectedRows];
      updatedSelectedRows.splice(selectedIndex, 1);
      setSelectedRows(updatedSelectedRows);
    }
  };

  const handleEdit = (rowData) => {
    setEditingRow(rowData);
  };

  const handleDelete = async (id) => {
    try {
      // for (const id of selectedRows) {
      await axios.delete(
        `https://cruds-assignment.onrender.com/api/users/${id}`
      );
      // }

      // Refresh table data after deletion
      const response = await axios.get(
        "https://cruds-assignment.onrender.com/api/getUsers"
      );
      setTableData(response.data.users);
      // Clear selected rows after deletion
      setSelectedRows([]);
    } catch (error) {
      console.log("Error deleting rows:", error);
    }
  };

  // https://cruds-assignment/api/api/send-email

  const handleSendData = async () => {
    try {
      const res = await axios.post("https://cruds-assignment.onrender.com/api/send-email", {
        selectedRows: filteredRows,
      });
      console.log("Succesfully sent email");
    } catch (error) {
      console.log("Error fetching table data:", error);
    }
  };

  // console.log(tableData, onSave);
  return (
    <div className={styles.mainPage}>
      {/* Form popup */}
      <Popover placement="auto-start">
        {({ onClose, isOpen }) => (
          <>
            <PopoverTrigger isOpen={isOpen}>
              <Button>Add User</Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                w="40vw"
                height="75vh"
                boxShadow="dark-lg"
                className="flex justify-center"
              >
                <PopoverCloseButton />
                <PopoverBody>
                  <Box>
                    <Form
                      onClose={onClose}
                      onOpen={onOpen}
                      onSave={onSave}
                      setOnSave={setOnSave}
                      editingRow={editingRow}
                      setEditingRow={setEditingRow}
                    />
                  </Box>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </>
        )}
      </Popover>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>S.No</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Hobbies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map((item) => (
              <tr key={item._id} onClick={() => handleRowClick(item._id)}>
                <td className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item._id)}
                  />
                </td>
                <td>{item.sno}</td>
                <td>{item.name}</td>
                <td>{item.phNo}</td>
                <td>{item.email}</td>
                <td>{item.hobbies}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </button>
                  <button onClick={() => handleDelete(item._id)}>
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* selected rows */}
      <div className="flex w-11/12 justify-between m-3">
        <p>
          {selectedRows.length} out of {tableData && tableData.length} rows
          selected rows
        </p>
        {selectedRows && (
          <div>
            <div ref={selectedRowsRef} style={{ display: "none" }}>
              Selected Data: {selectedRows}
            </div>
            <button
              className="bg-black rounded-lg text-white p-3"
              onClick={handleSendData}
            >
              Send Selected data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
