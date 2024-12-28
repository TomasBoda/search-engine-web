import styled from "styled-components"

export function Overlay({ showing }: { showing: boolean; }) {

    if (!showing) {
        return null;
    }

    return (
        <Container>
            <Text>Loading...</Text>
        </Container>
    )
}

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: black;
    z-index: 999;
`;

const Text = styled.div`
    color: white;
`;