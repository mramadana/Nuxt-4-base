export default function responseApi() {
    function response(res) {
      if (res.data.key == "success") {
        return "success";
      } else if (res.data.key == "error") {
        return "error";
      } else if (res.data.key == "unauthenticated") {
        return "unauthenticated";
      } else if (res.data.key == "blocked") {
        return "blocked";
      } else if (res.data.key == "exception") {
        return "exception";
      }
    }
  
    return { response };
  }
  