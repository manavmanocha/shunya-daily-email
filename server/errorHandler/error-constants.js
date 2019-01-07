module.exports = {
  ERROR_TYPES: {
    APPROVE_LEAVES: {
      COLLECTION: {
        ID:1,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      UPDATE: {
        ID:2,
        VALUE: "Update failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      }
    },
    APPROVED_LEAVES: {
      COLLECTION: {
        ID:3,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      EMPTY: {
        ID:4,
        VALUE: "Empty approved leaves",
        MESSAGE: "Sorry, there are no approved leaves."
      }
    },
    CANCEL_LEAVES: {
      COLLECTION: {
        ID:5,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      SESSION: {
        ID:6,
        VALUE: "User not found",
        MESSAGE:
          "Sorry, your session is lost. Please re-login in system and try again"
      }
    },
    CHANGE_PASSWORD: {
      COLLECTION: {
        ID:7,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      PASSWORD: {
        ID:8,
        VALUE: "Password not matched",
        MESSAGE: "Sorry, Your old password is incorrect. Please try again"
      },
      SESSION: {
        ID:9,
        VALUE: "User not found",
        MESSAGE:
          "Sorry, your session is lost. Please re-login in system and try again"
      }
    },
    CHANGE_USERNAME: {
      COLLECTION: {
        ID:10,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      PASSWORD_NOT_MATCHED: {
        ID:11,
        VALUE: "Password not matched",
        MESSAGE: "Sorry, Your old password is incorrect. Please try again"
      },
      SESSION: {
        ID:12,
        VALUE: "User not found",
        MESSAGE:
          "Sorry, your session is lost. Please re-login in system and try again"
      },
      USERNAME_EXISTS: {
        ID:13,
        VALUE: "Username Exists",
        MESSAGE:
          "Sorry, this username exists in the system. Take username that your admin can recognize you uniquely"
      }
    },
    CHECK_USER: {
      COLLECTION: {
        ID:14,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      SESSION: {
        ID:15,
        VALUE: "Id not found",
        MESSAGE:
          "Sorry, your session is lost. Please re-login in system and try again"
      }
    },
    CREATE_USER: {
      COLLECTION: {
        ID:16,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      INSERTION: {
        ID:17,
        VALUE: "Password not matched",
        MESSAGE: "Sorry, Your old password is incorrect. Please try again"
      },
      SESSION: {
        ID:18,
        VALUE: "User not found",
        MESSAGE:
          "Sorry, your session is lost. Please re-login in system and try again"
      },
      USERDATA_EXISTS: {
        ID:19,
        VALUE: "Username Exists",
        MESSAGE:
          "Sorry, this data exists in the system. Please feed unique data."
      }
    },
    FIND_TIME: {
      COLLECTION: {
        ID:20,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      }
    },
    FORGOT_PASSWORD: {
      INVALID: {
        ID:21,
        VALUE: "User not found",
        MESSAGE: "Sorry, please contact the admin. We are unable to help you."
      },
      COLLECTION: {
        ID:22,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      }
    },
    GET_LEAVES: {
      COLLECTION: {
        ID:23,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      SESSION: {
        ID:24,
        VALUE: "User not found",
        MESSAGE:
          "Sorry, your session is lost. Please re-login in system and try again"
      }
    },
    GET_USERNAME: {
      COLLECTION: {
        ID:25,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      SESSION: {
        ID:26,
        VALUE: "Id not found",
        MESSAGE:
          "Sorry, your session is lost. Please re-login in system and try again"
      }
    },
    MONTHLY_REPORT: {
      DATA_NOT_PRESENT: {
        ID:27,
        VALUE: "Empty Report",
        MESSAGE: "Sorry, no data present for the user."
      },
      ERROR: {
        ID:28,
        VALUE: "Report failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      }
    },
    PENDING_LEAVES: {
      COLLECTION: {
        ID:29,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      EMPTY: {
        ID:30,
        VALUE: "Empty pending leaves",
        MESSAGE: "Sorry, there are no pending leaves."
      }
    },
    RECORD_LEAVES: {
      COLLECTION: {
        ID:31,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      }
    },
    REJECT_LEAVE: {
      COLLECTION: {
        ID:32,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      UPDATE: {
        ID:33,
        VALUE: "Update failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      }
    },
    UNAPPROVE_LEAVE: {
      COLLECTION: {
        ID:34,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      UPDATE: {
        ID:35,
        VALUE: "Update failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      }
    },
    UPDATE_LEAVES: {
      COLLECTION: {
        ID:36,
        VALUE: "Collection Connection failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      }
    },
    UPDATE_TIME: {
      UPDATE: {
        ID:37,
        VALUE: "Update failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      },
      SESSION: {
        ID:38,
        VALUE: "User not found",
        MESSAGE:
          "Sorry, your session is lost. Please re-login in system and try again"
      }
    },
    YEARLY_REPORT: {
      DATA_NOT_PRESENT: {
        ID:39,
        VALUE: "Empty Report",
        MESSAGE: "Sorry, no data present for the user."
      },
      ERROR: {
        ID:40,
        VALUE: "Report failure",
        MESSAGE: "Sorry, something went wrong. Please try again later."
      }
    }
  }
};
