import React from "react"
import { Container } from "react-bootstrap"

const Parallax = () => {
    return (
        <div className="parallax mb-5">
            <Container className="text-center px-5 py-5 justify-content-center">
                <div className="animated-texts bounceIn">
                    <h1>
                        Với kinh nghiệm 30 năm <span className="hotel-color">Khách sạn An An</span>
                    </h1>
                    <h3>Cung cấp đầy đủ những thứ mà bạn cần.</h3>
                </div>
            </Container>
        </div>
    )
}

export default Parallax