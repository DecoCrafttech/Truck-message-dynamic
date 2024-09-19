function ChatUser({ user, onClick }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 10,
        margin: "10px 0px",
        cursor: "pointer",
        borderRadius: "5px",
      }}
      onClick={()=>onClick(user)}
    >
      <div className="d-flex justify-content-center align-items-center">
        <div className="col-2">
          <div
            style={{
              width: 32,
              height: 32,
              display: "flex",
              borderRadius: "50%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f3f3f3",
            }}
          >
            {user?.name?.toString().slice(0, 1).toUpperCase()}
          </div>
        </div>
        <div
          style={{
            fontWeight: "bold",
          }}
          className="d-flex flex-column col-10"
        >
          <span>
            {user?.name?.slice(0, 1).toUpperCase() +
              user?.name?.toString().slice(1)}
          </span>
         
        </div>
      </div>
    </div>
  );
}
export default ChatUser;
