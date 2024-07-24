import { IconButton, Stack, CircularProgress } from "@mui/material";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const observer = useRef();

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

  const loadMoreResults = useCallback(() => {
    setIsLoader(true);
    setPageNumber((prev) => prev + 1);
  }, []);

  const lastResultElementRef = useCallback(
    (node) => {
      if (isLoader) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && isMoreResults) {
          loadMoreResults();
        }
      });
      if (node);
    },
    [isLoader, isMoreResults, loadMoreResults]
  );

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
        {result.map((element, index) => {
          if (result.length === index + 1) {
            return (
              <div ref={lastResultElementRef} key={element.userId}>
                <AvtarUserwithFollowbtn
                  data={element}
                  onclick={closeDrawer}
                  setResult={setResult}
                />
              </div>
            );
          } else {
            return (
              <AvtarUserwithFollowbtn
                key={element.userId}
                data={element}
                onclick={closeDrawer}
                setResult={setResult}
              />
            );
          }
        })}
        {isLoader && (
          <div className="text-center p-4">
            <CircularProgress />
          </div>
        )}
      </Stack>
    </div>
  );
};

export default Search;
