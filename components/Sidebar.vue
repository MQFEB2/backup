<script>
const fetchData = async () => {
  let valueRaw = {};
  DataTB.value.reduce((acc, curr) => {
    if (curr.keyPm !== "") {
      valueRaw += `${curr.keyPm}:${curr.value},`;
    }
    return acc;
  }, {});
  console.log(valueRaw);
  console.log(bodyData.value);
  const body = JSON.parse(bodyData.value);
  const header = JSON.stringify(valueRaw).trim();
  console.log(inputData.value);
  console.log(header);
  console.log(body);

  const method = selectValue.value;
  console.log(method);
  const { data: temp } = await useFetch(inputData.value, {
    method: method,
    body: body,
    headers: {
      "Content-Type": "application/json",
      ...header,
    },
  });
  console.log(temp);
  receivedData.value = JSON.stringify(temp.value, undefined, 2);
};
</script>
