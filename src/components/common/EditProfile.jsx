import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Select,
  Flex,
  Button,
  ModalFooter,
  Avatar,
  Stack,
  Heading,
  FormLabel,
  Switch,
  useToast
} from "@chakra-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";
import { UPDATE_USER_DETAILS } from "../../graphql/mutations";
import { GET_UNITS } from "../../graphql/queries";

import { withApollo } from "react-apollo";

import EditPicture from "../common/EditPicture";

const EditProfile = ({ onClose, data, client, setUserData }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [heightUnits, setHeightUnits] = useState([]);
  const [weightUnits, setWeightUnits] = useState([]);
  const [updatedData, setUpdatedData] = useState(data);
  const [uploadFile, setUploadFile] = useState(null);

  const alert = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 9000,
      isClosable: true
    });
  };

  useEffect(() => {
    client
      .query({
        query: GET_UNITS
      })
      .then(res => {
        const weightUnit = res.data.units.filter(
          unit => unit.type === "weight"
        );
        const heightUnit = res.data.units.filter(
          unit => unit.type === "height"
        );
        setHeightUnits(heightUnit);
        setWeightUnits(weightUnit);
      })
      .catch(() => {
        alert(
          "An error occurred.",
          "Unable to complete onboarding. Please reload the page and try again",
          "error"
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      firstname: updatedData.firstname ? updatedData.firstname : "",
      lastname: updatedData.lastname ? updatedData.lastname : "",
      email: updatedData.email ? updatedData.email : "",
      height: updatedData.height,
      heightUnit: updatedData.heightUnit.id,
      weight: updatedData.weight,
      weightUnit: updatedData.weightUnit.id,
      goal: updatedData.goal ? updatedData.goal : "",
      reminderType: updatedData.reminderType
        ? updatedData.reminderType
        : "none",
      experience: updatedData.experience,
      photo: updatedData.photo
    },
    validationSchema: yup.object().shape({
      firstname: yup.string().required("Please enter your firstname"),
      lastname: yup.string().required("Please enter your lastname"),
      email: yup.string().email(),
      height: yup.number().required("Please enter your height"),
      heightUnit: yup.string().required("Please select your height unit"),
      weight: yup.number().required("Please enter your weight"),
      weightUnit: yup.string().required("Please select your weight unit"),
      goal: yup.string().required("Please enter your workout goal"),
      experience: yup.string().required("Please select your experience"),
      reminderType: yup.string()
    }),

    onSubmit: value => {
      setLoading(true);

      client
        .mutate({
          mutation: UPDATE_USER_DETAILS,
          variables: {
            firstname: value.firstname,
            lastname: value.lastname,
            experience: value.experience,
            equipment: value.equipment,
            height: value.height,
            weight: value.weight,
            heightUnit: value.heightUnit,
            weightUnit: value.weightUnit,
            goal: value.goal,
            reminderType: value.reminderType,
            photo: uploadFile
          }
        })
        .then(res => {
          setLoading(false);
          setUpdatedData(res.data.updateUser);
          alert("Profile Updated Successfully", "", "success");

          onClose();
          setTimeout(() => {
            window.location.reload();
          }, 500);
        })
        .catch(error => {
          setLoading(false);
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            alert(
              "An error occurred.",
              error.graphQLErrors[0].message,
              "error"
            );
          } else {
            alert("Unable to update profile", "", "error");
          }
        });
    }
  });

  return (
    <Box>
      <Stack>
        <Avatar
          src={data.photo}
          size="2xl"
          marginLeft="35%"
          marginBottom="20px"
        />
        <Heading size="sm">Edit Profile Picture</Heading>
        <EditPicture
          data={data}
          setUserData={setUserData}
          onClose={onClose}
          uploadFile={uploadFile}
          setUploadFile={setUploadFile}
          formik={formik}
        />
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Box paddingTop="30px">
          <Heading size="sm">First Name</Heading>
          <Input
            id="firstname"
            name="firstname"
            placeholder="FIRSTNAME"
            type="text"
            variant="flushed"
            onChange={formik.handleChange}
            value={formik.values.firstname}
            _hover="black"
            focusBorderColor="#FF8744"
            errorBorderColor="crimson"
            isInvalid={formik.errors.lastname}
          />
          {formik.errors.firstname && (
            <span className="error">{formik.errors.firstname}</span>
          )}
        </Box>
        <Box paddingTop="30px">
          <Heading size="sm">Last Name</Heading>
          <Input
            id="lastname"
            name="lastname"
            placeholder="LASTNAME"
            type="text"
            variant="flushed"
            onChange={formik.handleChange}
            value={formik.values.lastname}
            _hover="black"
            focusBorderColor="#FF8744"
            errorBorderColor="crimson"
            isInvalid={formik.errors.lastname}
          />
          {formik.errors.lastname && (
            <span className="error">{formik.errors.lastname}</span>
          )}
        </Box>
        <Box paddingTop="30px">
          <Heading size="sm">Email</Heading>
          <Input
            id="email"
            name="email"
            placeholder="EMAIL"
            type="email"
            isDisabled={true}
            variant="flushed"
            onChange={formik.handleChange}
            value={formik.values.email}
            _hover="black"
            focusBorderColor="#FF8744"
            errorBorderColor="crimson"
            isInvalid={formik.errors.email}
          />
          {formik.errors.email && (
            <span className="error">{formik.errors.email}</span>
          )}
        </Box>

        <Flex paddingTop="15px" alignItems="center">
          <Box paddingTop="30px">
            <Heading size="sm">Height</Heading>
            <Input
              id="height"
              name="height"
              placeholder="HEIGHT"
              type="number"
              variant="flushed"
              onChange={formik.handleChange}
              value={formik.values.height}
              _hover="black"
              focusBorderColor="#FF8744"
              errorBorderColor="crimson"
              isInvalid={formik.errors.height}
            />
            {formik.errors.height && (
              <span className="error">{formik.errors.height}</span>
            )}
          </Box>

          <Box>
            <Select
              marginLeft="30px"
              marginTop="30px"
              name="heightUnit"
              onChange={formik.handleChange}
              value={formik.values.heightUnit}
              isInvalid={formik.errors.heightUnit}
            >
              {heightUnits.map(heightUnit => (
                <option
                  key={heightUnit.name}
                  className="unitButton"
                  value={heightUnit.id}
                >
                  {heightUnit.name.charAt(0).toUpperCase() +
                    heightUnit.name.slice(1)}
                </option>
              ))}
            </Select>

            {formik.errors.heightUnit && (
              <span className="error">{formik.errors.heightUnit}</span>
            )}
          </Box>
        </Flex>
        <Flex paddingTop="15px" alignItems="center">
          <Box paddingTop="30px">
            <Heading size="sm">Weight</Heading>
            <Input
              id="weight"
              name="weight"
              placeholder="WEIGHT"
              type="number"
              variant="flushed"
              onChange={formik.handleChange}
              value={formik.values.weight}
              _hover="black"
              focusBorderColor="#FF8744"
              errorBorderColor="crimson"
              isInvalid={formik.errors.weight}
            />

            {formik.errors.weight && (
              <span className="error">{formik.errors.weight}</span>
            )}
          </Box>

          <Box>
            <Select
              name="weightUnit"
              marginLeft="30px"
              marginTop="30px"
              onChange={formik.handleChange}
              value={formik.values.weightUnit}
              isInvalid={formik.errors.weightUnit}
            >
              {weightUnits.map(weightUnit => (
                <option
                  key={weightUnit.name}
                  className="unitButton"
                  value={weightUnit.id}
                >
                  {weightUnit.name.charAt(0).toUpperCase() +
                    weightUnit.name.slice(1)}
                </option>
              ))}
            </Select>

            {formik.errors.weightUnit && (
              <span className="error">{formik.errors.weightUnit}</span>
            )}
          </Box>
        </Flex>

        <Flex paddingTop="15px" alignItems="center">
          <Box paddingTop="30px">
            <Heading size="sm">Experience</Heading>
          </Box>

          <Box>
            <Select
              name="experience"
              marginLeft="30px"
              marginTop="30px"
              onChange={formik.handleChange}
              value={formik.values.experience}
              isInvalid={formik.errors.experience}
            >
              <option className="experience" value="Beginner">
                Beginner
              </option>

              <option className="experience" value="Intermediate">
                Intermediate
              </option>

              <option className="experience" value="Expert">
                Expert
              </option>
            </Select>
            {formik.errors.experience && (
              <span className="error">{formik.errors.experience}</span>
            )}
          </Box>
        </Flex>

        <Box paddingTop="15px">
          <Heading size="sm">Goal</Heading>
          <Input
            id="goal"
            name="goal"
            placeholder="WORKOUT GOAL"
            type="string"
            variant="flushed"
            onChange={formik.handleChange}
            value={formik.values.goal}
            _hover="black"
            focusBorderColor="#FF8744"
            errorBorderColor="crimson"
            isInvalid={formik.errors.goal}
          />

          {formik.errors.goal && (
            <span className="error">{formik.errors.goal}</span>
          )}
        </Box>
        <Flex paddingTop="15px" alignItems="center">
          <FormLabel htmlFor="email-alerts">Enable email alerts?</FormLabel>
          <Switch
            name="reminderType"
            id="email-alerts"
            isChecked={formik.values.reminderType === "email"}
            onChange={event =>
              formik.setFieldValue(
                "reminderType",
                event.target.checked ? "email" : "notification"
              )
            }
          />
        </Flex>
        <ModalFooter>
          <Button
            type="submit"
            variantColor="orange"
            mr={3}
            isLoading={loading}
          >
            Save
          </Button>
          <Button variant="ghost" variantColor="orange" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Box>
  );
};

export default withApollo(EditProfile);
