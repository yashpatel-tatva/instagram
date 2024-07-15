import React, { useEffect, useRef, useState } from "react";
import {
  changeuserphoto,
  deleteprofilephoto,
  getuserdata,
  getuserphoto,
  updateuserprofile,
  useSelectorUserAction,
  userAction,
} from "../../redux/slices/UserActionSlice";
import { Button, Grid, IconButton, Stack } from "@mui/material";
import Swal from "sweetalert2";
import { useSelectorUserState } from "../../redux/slices/AuthSlice";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import styles from "../custominputs/CustomInputField.module.css";
import {
  emailRegex,
  phoneRegex,
  urlRegex,
  usernameRegex,
} from "../../constants/Regex";
import "react-toastify/dist/ReactToastify.css";
import ProfileLoader from "../loaders/ProfileLoader";
import { useNavigate } from "react-router-dom";
import { AllRoutes } from "../../constants/AllRoutes";
import DeleteIcon from "@mui/icons-material/Delete";

const EditProfile = () => {
  const { userid } = useSelectorUserState();
  const { user, userPhoto, ErrorMessageArray, isProfileUpdated } =
    useSelectorUserAction();
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [apiErrors, setApiErrors] = useState([]);

  useEffect(() => {
    setApiErrors(ErrorMessageArray);
  }, [ErrorMessageArray]);

  const [customErrors, setCustomErrors] = useState({});

  useEffect(() => {
    const errors = {};
    if (apiErrors) {
      const mobileError = apiErrors.find((x) => x.reference === "mobileNumber");
      if (mobileError) {
        errors.contactNumber = mobileError.message;
      }

      const emailError = apiErrors.find((x) => x.reference === "email");
      if (emailError) {
        errors.email = emailError.message;
      }

      const usernameError = apiErrors.find((x) => x.reference === "username");
      if (usernameError) {
        errors.userName = usernameError.message;
      }
    }
    setCustomErrors(errors);
    formik.setErrors(errors);
  }, [apiErrors]);

  useEffect(() => {
    if (!Object.keys(user).length > 0) {
      dispatch(getuserdata(userid));
    }
    if (Object.keys(user).length > 0) {
      formik.setValues({
        userId: userid,
        userName: user.userName || "",
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "",
        contactNumber: user.contactNumber || "",
        dateOfBirth: user.dateOfBirth || "",
        bio: user.bio || "",
        link: user.link || "",
        isPrivate: user.isPrivate,
      });
      setLoading(false);
    }
  }, [userid, dispatch, user]);

  const navigate = useNavigate();
  useEffect(() => {
    if (isProfileUpdated) {
      navigate(AllRoutes.UserProfile);
    }
  }, [isProfileUpdated]);

  const fileInputRef = useRef(null);

  const handleFileRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && allowedTypes.includes(file.type) && file.size < 1024000) {
      const formData = new FormData();
      // formData.append("UserId", userid);
      formData.append("ProfilePhoto", file);
      const res = await dispatch(changeuserphoto(formData));
      if (res.payload.isSuccess) {
        await dispatch(
          getuserphoto({
            userId: userid,
            photoName: res.payload.data.profilePhotoName,
          })
        );
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: res.payload.data[0].message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else if (file.size > 1024000) {
      Swal.fire("Please select a file with less than 1MB.");
    } else {
      Swal.fire("Please select a valid JPG or PNG file.");
    }
  };

  const handledelete = async () => {
    const formData = new FormData();
    formData.append("ProfilePhoto", null);
    const res = await dispatch(changeuserphoto(formData));
    if (res.payload.isSuccess) {
      await dispatch(
        getuserphoto({
          userId: userid,
          photoName: res.payload.data.profilePhotoName,
        })
      );
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Some Issue By server",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const validate = (values) => {
    const errors = {};

    if (!values.userName) {
      errors.userName = "Required";
    } else if (!usernameRegex.test(values.userName)) {
      errors.userName = "Invalid username format";
    }

    if (!values.email) {
      errors.email = "Required";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (
      values.gender &&
      !["male", "female"].includes(values.gender.toLowerCase())
    ) {
      errors.gender = "Invalid gender";
    }

    if (values.contactNumber && !phoneRegex.test(values.contactNumber)) {
      errors.contactNumber = "Invalid phone number";
    }

    if (values.link && !urlRegex.test(values.link)) {
      errors.link = "Invalid Link";
    }

    if (!values.dateOfBirth) {
      errors.dateOfBirth = "Required";
    } else if (values.dateOfBirth && !isValidDate(values.dateOfBirth)) {
      errors.dateOfBirth = "Invalid date format (YYYY-MM-DD)";
    } else if (new Date(values.dateOfBirth) > new Date()) {
      errors.dateOfBirth = "Date of birth must not be greater than today";
    }
    Object.assign(errors, customErrors);
    console.log(errors);
    return errors;
  };

  const isValidDate = (dateString) => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; // Invalid format
    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
  };

  const formik = useFormik({
    initialValues: {
      userId: userid,
      userName: user.userName || "",
      name: user.name || "",
      email: user.email || "",
      gender: user.gender || "",
      contactNumber: user.contactNumber || "",
      dateOfBirth: user.dateOfBirth || "",
      bio: user.bio || "",
      link: user.link || "",
      isPrivate: user.isPrivate,
    },
    validate,
    onSubmit: (values) => {
      values.isPrivate =
        values.isPrivate === "true" || values.isPrivate === true;
      dispatch(updateuserprofile(JSON.stringify(values, null, 2)));
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);

    // Remove the custom error for this field
    setCustomErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  useEffect(() => {
    dispatch(userAction.clearErrors());
  }, [dispatch]);

  return (
    <div className="p-12 md:p-8 fm:p-6">
      {loading ? (
        <ProfileLoader
          className="w-1/5 md:w-2/5 mt-6 flex justify-center items-center"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <>
          <p className="font-bold text-lg">Edit Profile</p>
          <div className="mt-3">
            <div className="rounded-lg flex bg-gray-100 p-2 items-center">
              <div className="flex">
                <div>
                  <img
                    className="rounded-full"
                    src={userPhoto}
                    alt="profile"
                    width={"80px"}
                    style={{ objectFit: "cover", aspectRatio: "1" }}
                  ></img>
                </div>
              </div>
              <div className="flex sm:flex-col items-center p-3 justify-between sm:items-start w-full">
                <div className="">
                  <div className="font-bold">{user.userName}</div>
                  <div className="sm:hidden">{user.name}</div>
                </div>
                <div>
                  <Button component="label" variant="contained">
                    <input
                      hidden
                      type="file"
                      ref={fileInputRef}
                      onClick={handleFileRemove}
                      onChange={handleFileChange}
                    ></input>
                    Change Photo
                  </Button>
                  {user.profilePictureName && (
                    <IconButton
                      aria-label="delete"
                      size="large"
                      onClick={handledelete}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                  <div className="mt-3">
                    <div
                      className={`${styles.formGroup} flex items-center rounded`}
                    >
                      <input
                        type="text"
                        name="userName"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.userName}
                        className={styles.formControl}
                        placeholder=""
                      />
                      <span>Username</span>
                    </div>
                    {formik.errors.userName && (
                      <div className="text-red-500">
                        {formik.errors.userName}
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <div className="mt-3">
                    <div
                      className={`${styles.formGroup} flex items-center rounded`}
                    >
                      <input
                        type="text"
                        name="name"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        className={styles.formControl}
                        placeholder=""
                      />
                      <span>Name</span>
                    </div>
                    {formik.errors.name && formik.touched.name && (
                      <div className="text-red-500">{formik.errors.name}</div>
                    )}
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <div className="mt-3">
                    <div
                      className={`${styles.formGroup} flex items-center rounded`}
                    >
                      <input
                        type="email"
                        name="email"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className={styles.formControl}
                        placeholder=""
                      />
                      <span>Email</span>
                    </div>
                    {formik.errors.email && (
                      <div className="text-red-500">{formik.errors.email}</div>
                    )}
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <div className="mt-3">
                    <div
                      className={`${styles.formGroup} flex items-center rounded`}
                    >
                      <select
                        type="text"
                        name="gender"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.gender}
                        className={styles.formControl}
                        placeholder=""
                        style={{ width: "100%   " }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <span>Gender</span>
                    </div>
                    {formik.errors.gender && formik.touched.gender && (
                      <div className="text-red-500">{formik.errors.gender}</div>
                    )}
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <div className="mt-3">
                    <div
                      className={`${styles.formGroup} flex items-center rounded`}
                    >
                      <input
                        type="text"
                        name="contactNumber"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.contactNumber}
                        className={styles.formControl}
                        placeholder=""
                      />
                      <span>Contact Number</span>
                    </div>
                    {formik.errors.contactNumber && (
                      <div className="text-red-500">
                        {formik.errors.contactNumber}
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <div className="mt-3">
                    <div
                      className={`${styles.formGroup} flex items-center rounded`}
                    >
                      <input
                        type="date"
                        name="dateOfBirth"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.dateOfBirth}
                        className={styles.formControl}
                        placeholder=""
                        max={today}
                      />
                      <span>Date of Birth</span>
                    </div>
                    {formik.errors.dateOfBirth &&
                      formik.touched.dateOfBirth && (
                        <div className="text-red-500">
                          {formik.errors.dateOfBirth}
                        </div>
                      )}
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <div className="mt-3">
                    <div
                      className={`${styles.formGroup} flex items-center rounded`}
                    >
                      <input
                        type="text"
                        name="bio"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.bio}
                        className={styles.formControl}
                        placeholder=""
                      />
                      <span>Bio</span>
                    </div>
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <div className="mt-3">
                    <div
                      className={`${styles.formGroup} flex items-center rounded`}
                    >
                      <input
                        type="text"
                        name="link"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.link}
                        className={styles.formControl}
                        placeholder=""
                      />
                      <span>Link</span>
                    </div>
                    {formik.errors.link && formik.touched.link && (
                      <div className="text-red-500">{formik.errors.link}</div>
                    )}
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <div className="mt-3">
                    <div
                      className={`${styles.formGroup} flex items-center rounded`}
                    >
                      <select
                        type="text"
                        name="isPrivate"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.isPrivate}
                        className={styles.formControl}
                        placeholder=""
                      >
                        <option value="true">Private Account</option>
                        <option value="false">Public Account</option>
                      </select>
                      <span>isPrivate</span>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Stack direction={"row"} justifyContent={"end"}>
                <button
                  type="submit"
                  className={`mt-3 bg-blue-500 text-white px-4 py-2 rounded ${
                    !formik.dirty ? "hidden" : ""
                  }`}
                >
                  Submit
                </button>
              </Stack>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default EditProfile;
