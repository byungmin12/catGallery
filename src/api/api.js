const API_ENDPOINT =
  "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev";

export const request = async (nodeId) => {
  try {
    const result = await fetch(`${API_ENDPOINT}/${nodeId ? nodeId : ""}`);
    if (!result.ok) {
      console.log("errrrr");
      throw new Error("err");
    } else {
      return await result.clone().json();
    }
  } catch (err) {
    throw new Error(`${err.message}`);
  }
};

const api = {
  fetchRoot() {
    return request();
  },
  fetchDirectory(nodeId) {
    return request(nodeId);
  },
};
