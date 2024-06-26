function UserDetails({
  id,
  student
}: {
  id: string | undefined;
  student: any;
}) {
  const isMe = window.location.pathname.split("/").at(-1) === "me";
  const { name } = student;

  return (
    <div className="p-4">
      <div className="flex flex-col justify-between">
        <div>
          {isMe ? (
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {name}
            </h1>
          ) : (
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {name}
            </h1>
          )}
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {id}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
