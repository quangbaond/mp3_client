import { BANNER_ALBUM_HOT, BANNER_SINGER_POPULAR } from '../../redux/constant';
import Container from '../Container/Container';
import Trending from './Trending/Trending';

function Content() {
    return (
        <div>
            <div>
                <Container
                    listData={BANNER_SINGER_POPULAR}
                    titleSection="Nghệ Sĩ Thịnh Hành"
                />
            </div>
            <div style={{ marginTop: "20px" }}>
                <Trending />
            </div>

            <div>
                <Container listData={BANNER_ALBUM_HOT} titleSection="Album Hot" />
            </div>
        </div>
    );
}

export default Content;
