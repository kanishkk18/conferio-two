import CircularText from "../ui/CircularTextLoader";

const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <div role="status">
        <Spinner />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

const Spinner = () => {
  return (
     <div className="min-h-screen flex items-center justify-center">
            <CircularText
              text="CONFERIO*CALLS*"
              onHover="speedUp"
              spinDuration={5}
              className="custom-class"
            />
          </div>
  );
};

export default Loading;
