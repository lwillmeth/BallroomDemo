# Advanced Ballroom Dancing Microservice Challenge

## Introduction

This is my solution to the [Advanced Ballroom Dancing Microservice Challenge](./requirements.md).

## Usage

Requirements:
- Docker

`docker compose up`

This should start a docker container and expose the service on localhost:3000

## API Documentation

## POST `/calculate-partners`

Calculates the average number of dance partners for a given ballroom event.

### Request

- **URL:** `/calculate-partners`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body

The body must match the `CalculatePartnersRequest` interface:

| Field                   | Type                | Description                                                      | Required |
|-------------------------|---------------------|------------------------------------------------------------------|----------|
| `total_leaders`         | `number`            | Total number of leaders. Must be > 0.                            | Yes      |
| `total_followers`       | `number`            | Total number of followers. Must be > 0.                          | Yes      |
| `dance_styles`          | `string[]`          | List of dance styles for the event. At least one required.        | Yes      |
| `leader_knowledge`      | `object`            | Map of leader IDs to the dance styles they know.                 | Yes      |
| `follower_knowledge`    | `object`            | Map of follower IDs to the dance styles they know.               | Yes      |
| `dance_duration_minutes`| `number`            | Total event duration in minutes. Must be ≥ 5.                    | Yes      |

**Example:**
```json
{
  "total_leaders": 2,
  "total_followers": 3,
  "dance_styles": ["Waltz", "Tango", "Foxtrot"],
  "leader_knowledge": {
    "1": ["Waltz", "Tango"],
    "2": ["Foxtrot"]
  },
  "follower_knowledge": {
    "A": ["Waltz", "Tango", "Foxtrot"],
    "B": ["Tango"],
    "C": ["Waltz"]
  },
  "dance_duration_minutes": 15
}
```

### Response

- **Success (200):**
  ```json
  {
    "average_dance_partners": 2
  }
  ```

- **Error (400):**
  ```json
  {
    "error": "Description of the error"
  }
  ```

### Description

Send a POST request to `/calculate-partners` with the event and dancer data.  
The response will include the calculated average number of dance partners per leader, or an error message if the input is invalid.

## GET `/dance-preferences`

Returns the most and least popular dance styles based on the number of dances performed during the session.

### Request

- **URL:** `/dance-preferences`
- **Method:** `GET`
- **Content-Type:** `application/json`

### Response

- **Success (200):**
  ```json
  {
    "mostPopular": "Waltz",
    "leastPopular": "Tango",
    "all": {
      "Waltz": 10,
      "Tango": 2,
      "Foxtrot": 5
    }
  }
  ```

  - `mostPopular`: The dance style with the highest count (or `null` if none).
  - `leastPopular`: The dance style with the lowest count (or `null` if none).
  - `all`: An object mapping each dance style to the number of times it was danced.

- **If no data is available:**
  ```json
  {
    "mostPopular": null,
    "leastPopular": null
  }
  ```

### Description

This endpoint analyzes the session data and returns which dance styles were the most and least popular, as well as a breakdown of all tracked styles and their counts.