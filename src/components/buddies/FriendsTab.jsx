import React, { useEffect, useState } from "react";
import { Box, Flex, useToast } from "@chakra-ui/core";
import { withApollo } from "react-apollo";
import { Redirect } from "react-router-dom";

import { GET_FRIENDS } from "../../graphql/queries";
import Search from "../common/Search";
import CustomSpinner from "../common/Spinner";
import BuddiesCard from "./BuddiesCard";

const FriendsTab = ({ client, setFriends, friends }) => {
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

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
        query: GET_FRIENDS,
        variables: {
          search,
          fields: ["firstname", "lastname", "email"]
        }
      })
      .then(res => {
        setFriends(res.data.friends);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        alert("An error occurred.", "Unable to load friends", "error");
        setError(true);
      });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = e => {
    const inputSearch = e.target.value;
    setSearch(inputSearch);

    client
      .query({
        query: GET_FRIENDS,
        variables: {
          search: inputSearch,
          fields: ["firstname", "lastname", "email"]
        }
      })
      .then(res => {
        setFriends(res.data.friends);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        alert("An error occurred.", "Unable to add friend", "error");
        setError(true);
      });
  };

  if (isLoading) {
    return (
      <Flex width="100vw" height="100vh" justifyContent="center" align="center">
        <CustomSpinner thickness="6px" size="xl" text="Loading..." />
      </Flex>
    );
  }

  if (error) {
    alert("An error occurred.", "Unable to show friends list", "error");
    return <Redirect to="/" />;
  }

  return (
    <Box>
      <Search
        placeholder="Find friends"
        search={search}
        id="search-friends"
        onChange={onSearch}
      />
      {friends.map(buddy => (
        <div key={buddy.id}>
          <BuddiesCard
            name={`${buddy.firstname} ${!buddy.lastname ? "" : buddy.lastname}`}
            goal={buddy.goal}
            icon="chat"
            text="Message"
            variant="outline"
            isMessage={true}
            photo={buddy.photo}
            link={`/messages/${buddy.id}`}
          />
        </div>
      ))}
    </Box>
  );
};

export default withApollo(FriendsTab);
