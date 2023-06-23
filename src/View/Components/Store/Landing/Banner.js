import { Carousel } from "react-bootstrap";
import BannerZero from "../../../../assets/img/banner-0.jpg";
import BannerOne from "../../../../assets/img/banner-1.jpeg";
import BannerTwo from "../../../../assets/img/banner-2.png";

function SlideContent(props) {
  return (
    <>
      <div
        className="ratio"
        style={{ "--bs-aspect-ratio": "50%", maxHeight: "460px" }}
      >
        <img
          className="d-block w-100 h-100 bg-dark cover"
          alt=""
          src={props.image}
        />
        <div className="overlay" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
        </div>
      </div>
      <Carousel.Caption>
        <h3 className="text-white fw-bold">{props.title}</h3>
        <p>{props.description}</p>
      </Carousel.Caption>
    </>
  );
}

const Banner = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <SlideContent
          image={BannerZero}
          title="Selamat Datang di TemanTani"
          description="TemanTani adalah sebuah platform yang mempertemukan petani dengan para pekerja pertanian."
        />
      </Carousel.Item>
      <Carousel.Item>
        <SlideContent
          image={BannerOne}
          title="Dapatkan Komoditas Pertanian Terbaik"
          description="TemanTani menyediakan komoditas pertanian terbaik untuk Anda."
        />
      </Carousel.Item>
      <Carousel.Item>
        <SlideContent
          image={BannerTwo}
          title="Belanja Secara Online"
          description="TemanTani menyediakan layanan belanja komoditas pertanian secara online untuk Anda."
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default Banner;
