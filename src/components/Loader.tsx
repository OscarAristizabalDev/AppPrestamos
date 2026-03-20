import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

const Loader = ({
  size = "large",
  color = "#6C63FF",
  ...rest
}: LoaderProps) => <ActivityIndicator size={size} color="#6C63FF" {...rest} />;

interface LoaderProps extends ActivityIndicatorProps {
  center?: boolean;
}

export default Loader;
