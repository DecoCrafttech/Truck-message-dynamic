export const statesData = [
    { value: 1, label: "Andaman and Nicobar Islands" },
    { value: 2, label: "Haryana" },
    { value: 3, label: "Tamil Nadu" },
    { value: 4, label: "Madhya Pradesh" },
    { value: 5, label: "Jharkhand" },
    { value: 6, label: "Mizoram" },
    { value: 7, label: "Nagaland" },
    { value: 8, label: "Himachal Pradesh" },
    { value: 9, label: "Tripura" },
    { value: 10, label: "Andhra Pradesh" },
    { value: 11, label: "Punjab" },
    { value: 12, label: "Chandigarh" },
    { value: 13, label: "Rajasthan" },
    { value: 14, label: "Assam" },
    { value: 15, label: "Odisha" },
    { value: 16, label: "Chhattisgarh" },
    { value: 17, label: "Jammu and Kashmir" },
    { value: 18, label: "Karnataka" },
    { value: 19, label: "Manipur" },
    { value: 20, label: "Kerala" },
    { value: 21, label: "Delhi" },
    { value: 22, label: "Dadra and Nagar Haveli" },
    { value: 23, label: "Puducherry" },
    { value: 24, label: "Uttarakhand" },
    { value: 25, label: "Uttar Pradesh" },
    { value: 26, label: "Bihar" },
    { value: 27, label: "Gujarat" },
    { value: 28, label: "Telangana" },
    { value: 29, label: "Meghalaya" },
    { value: 30, label: "Arunachal Pradesh" },
    { value: 31, label: "Maharashtra" },
    { value: 32, label: "Goa" },
    { value: 33, label: "West Bengal" }
]

statesData.sort((a, b) => {
  const labelA = a.label.toUpperCase(); // ignore upper and lowercase
  const labelB = b.label.toUpperCase(); // ignore upper and lowercase
  if (labelA < labelB) {
    return -1;
  }
  if (labelA > labelB) {
    return 1;
  }

  // labels must be equal
  return 0;
});