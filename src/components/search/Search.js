import { IconButton, Stack, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CustomInputField from "../custominputs/CustomInputField";
import { useSelectorUserState } from "../../redux/slices/AuthSlice";
import { useDispatch } from "react-redux";
import { searchbyusername } from "../../redux/slices/UserActionSlice";
import AvtarUserwithFollowbtn from "../avtarofuser/AvtarUserwithFollowbtn";

const Search = ({ closeDrawer }) => {
  const { userid } = useSelectorUserState();

  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isMoreResults, setIsMoreResults] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoader(true);
      const formData = {
        pageNumber,
        pageSize: 10,
        searchName: searchValue,
        model: {
          userId: userid,
        },
      };
      const res = await dispatch(searchbyusername(formData));
      const newResults = res.payload.data.record;

      setResult((prev) => [...prev, ...newResults]);
      setIsMoreResults(newResults.length === 10);
      setIsLoader(false);
    };

    const delayDebounceFn = setTimeout(fetchResults, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, pageNumber, dispatch, userid]);

  const handleSearch = (value) => {
    setResult([]);
    setSearchValue(value);
    setPageNumber(1);
  };

  const loadMoreResults = () => {
    setIsLoader(true);
    setPageNumber((prev) => prev + 1);
  };

  return (
    <div>
      <div className="sticky top-0 bg-white z-10 pb-3">
        <div className="flex justify-between p-2 items-center">
          <span className="font-semibold">Search</span>
          <IconButton aria-label="close" onClick={closeDrawer}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="px-3">
          <CustomInputField
            type={"search"}
            label={"Search"}
            onInputChange={handleSearch}
          />
        </div>
      </div>
      <Stack spacing={3} overflow="scroll">
        {result.map((element) => (
          <AvtarUserwithFollowbtn
            key={element.userId}
            data={element}
            onclick={closeDrawer}
            setResult={setResult}
          />
        ))}
        {isMoreResults && (
          <div className="text-center p-4" onClick={loadMoreResults}>
            <p role="button" className="text-cyan-600 p-3">
              {isLoader ? <CircularProgress /> : "Load More"}
            </p>
          </div>
        )}
      </Stack>
    </div>
  );
};

export default Search;
