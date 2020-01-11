import { gql } from "apollo-boost";

export const LOGIN_QUERY = gql`
  query authForm($email: String!, $password: String!, $remember: Boolean!) {
    authForm(
      input: { email: $email, password: $password, remember: $remember }
    ) {
      id
      token
      isNewUser
    }
  }
`;

export const GET_UNITS = gql`
  query {
    units {
      id
      name
      type
    }
  }
`;

export const GET_COMPLETED_WORKOUTS = gql`
  query {
    completedWorkouts {
      id
      userId
      workoutId {
        id
        name
        intensity
        avgTime
        session {
          startDate
          endDate
        }
      }
      startDate
      endDate
      pause
      picture
    }
  }
`;

export const GET_WORKOUT_DETAILS = gql`
  query {
    workouts {
      name
      intensity
      types
      id
      picture
    }
  }
`;

export const GET_WORKOUT_DETAIL = gql`
  query($id: String!) {
    workout(id: $id) {
      name
      intensity
      types
      id
      description
      avgTime
      equipment
      session {
        pause
      }
      muscles
      picture
      exercises {
        id
        video
        difficulty
        pictureOne
        pictureTwo
        rating
        equipment
        type
        description
        muscle
        name
        time
      }
    }
  }
`;

export const GET_EXERCISES = gql`
  query {
    exercises {
      id
      video
      difficulty
      pictureOne
      pictureTwo
      rating
      equipment
      type
      muscle
      name
      time
    }
  }
`;

export const GET_EXERCISE = gql`
  query excercise($id: String!) {
    exercise(id: $id) {
      id
      video
      difficulty
      pictureOne
      pictureTwo
      rating
      equipment
      type
      muscle
      name
      description
    }
  }
`;
