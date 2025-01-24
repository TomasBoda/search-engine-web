import { useEffect } from "react";
import styled from "styled-components"
import { hideTransition, showTransition } from "./transition";

export function Overlay({ showing }: { showing: boolean; }) {

    useEffect(() => {
        if (showing) {
            showTransition();
        } else {
            hideTransition();
        }
    }, [showing]);

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
    z-index: 199;
`;

const Text = styled.div`
    color: white;
`;