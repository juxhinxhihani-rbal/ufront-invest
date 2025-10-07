export const walkInCustomerOverviewPageI18n = {
  error: {
    customerNotFound: {
      title: {
        en: "Oops!",
        sq: "Uups!",
      },
      description: {
        en: (customerId: string) =>
          `WalkIn Customer with ID: ${customerId} was not found!`,
        sq: (customerId: string) =>
          `WalkIn Customer me ID ${customerId} nuk u gjet!`,
      },
      button: {
        en: "Go back",
        sq: "Kthehu",
      },
    },
  },
};
