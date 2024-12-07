import styled from "styled-components";

export class Page {

    public static Container = styled.div`
        width: 100vw;

        display: flex;
        flex-direction: column;
        align-items: center;
    `;

    public static Content = styled.div`
        width: 100%;
        max-width: 2000px;

        padding: 50px;
    `;
}

export class Component {

    public static SearchField = styled.input`
        width: 400px;

        color: var(--c-white);
        font-size: 12px;
        font-weight: 400;
        line-height: 100%;

        padding: 8px;

        background-color: var(--c-gray);

        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        outline: none;
    `;

    public static Button = styled.div`
        color: var(--c-black);
        font-size: 12px;
        font-weight: 400;
        line-height: 100%;

        padding: 10px 25px;

        background-color: var(--c-white);

        border: 2px solid var(--c-white);
        border-radius: 5px;
        outline: none;

        cursor: pointer;
        transition: all 100ms;

        &:hover {
            background-color: var(--c-lightgray);
            border-color: var(--c-lightgray);
        }
    `;
}