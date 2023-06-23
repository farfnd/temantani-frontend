import Header from "./Store/Header";
import Content from "./Store/Content";
import Footer from "./Store/Footer";

const StoreLayout = (props) => {

  return (
    <>
      <Header />
      <Content>{props.body}</Content>
      <Footer />
    </>
  );

}

export default StoreLayout;
