export const getDefaultStateId = (momentData?: string) => {
  if (!momentData) return "";
  try {
    const dataMoment = JSON.parse(momentData);
    return dataMoment?.versions["v3.0"]?.defaultStateId;
  } catch (error) {
    return "";
  }
};
