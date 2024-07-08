import { IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CustomInputField from "../custominputs/CustomInputField";
import { useSelectorUserState } from "../../redux/slices/AuthSlice";
import { useDispatch } from "react-redux";
import { searchbyusername } from "../../redux/slices/UserActionSlice";
import SearchEntity from "./SearchEntity";

const Search = ({ closeDrawer }) => {
  const { userid } = useSelectorUserState();

  const [searchValue, setSearchValue] = useState("");

  const [result, setResult] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchValue && searchValue.trim() !== "") {
        const formData = {
          pageNumber: 1,
          pageSize: 30,
          searchName: searchValue,
          model: {
            userId: userid,
          },
        };
        const res = await dispatch(searchbyusername(formData));
        let list = [];
        res.payload.data.record.forEach((element) => {
          list.push(element);
        });
        console.log(list);
        setResult(list);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, dispatch, userid]);

  function searchHandle(value) {
    setSearchValue(value);
  }

  return (
    <div>
      <div className="flex justify-between p-2 items-center">
        <span className="font-semibold">Seacrh</span>
        <IconButton aria-label="delete" onClick={closeDrawer}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="px-3">
        <CustomInputField
          type={"search"}
          label={"Search"}
          onInputChange={searchHandle}
        ></CustomInputField>
      </div>
      <Stack spacing={3}>
        {result &&
          result.map((element, index) => {
            return (
              <SearchEntity
                onClick={closeDrawer}
                key={index}
                data={element}
              ></SearchEntity>
            );
          })}
      </Stack>
    </div>
  );
};

export default Search;
