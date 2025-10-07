export const temporaryUnblockRequestsI18n = {
  header: {
    en: "Approve Temporary Unblock Request",
    sq: "Aprovo kërkesën për zhbllokim të përkohshëm",
  },
  pleaseWait: {
    en: "Please wait",
    sq: "Ju lutem prisni",
  },
  rejectRequest: {
    en: "Reject Unblock",
    sq: "Anullo Zhbllokimin",
  },
  cancelOrder: {
    en: "Approve Unblock",
    sq: "Autorizo Zhbllokimin",
  },
  sendForProcessSuccess: {
    en: "The requests were successfully sent for processing.",
    sq: "Kërkesat u dërguan me sukses për procesim",
  },
  sendForProcessError: {
    en: "The requests were not sent for processing.",
    sq: "Kërkesat nuk u dërguan për procesim",
  },
  cancelRequestSuccess: {
    en: "The requests were successfully canceled.",
    sq: "Kërkesat u anulluan me sukses.",
  },
  cancelRequestError: {
    en: "The requests were not canceled.",
    sq: "Kërkesat nuk u anulluan",
  },
  refusedRequestsSuccessMessage: {
    en: (requests: number) =>
      `U refuzuan ${requests} kërkesa për zhbllokim të përkohshëm`,
    sq: (requests: number) =>
      `${requests} requests for temporary unblocking were rejected`,
  },
  refusedRequestsErrorMessage: {
    en: "Kërkesat për zhbllokim të përkohshëm nuk u refuzuan",
    sq: "Requests for temporary unblocking were not rejected",
  },
  canceledRequestsSuccessMessage: {
    en: (requests: number) => `U anulluan ${requests} urdhër bllokime`,
    sq: (requests: number) => `${requests} blocking orders were canceled`,
  },
  canceledRequestsErrorMessage: {
    en: "Kërkesat për anullim urdhëri bllokimi nuk u anulluan",
    sq: "Requests for cancel the blocking order were not canceled",
  },
};
