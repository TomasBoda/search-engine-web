import { Page } from "@/styles/styles";
import styled from "styled-components";
import { DocumentObject } from "@/pages/search";

export function DocumentScreen({ document }: { document: DocumentObject; }) {

    function getDocumentTitle(): string {
        return document.content.split("\n")[0].trim();
    }

    function getDocumentHtml(): string {
        return document.content.split("\n").slice(2).join("<br />");
    }

    return (
        <Page.Container>
            <Page.Content>
                <Content>
                    <Title>{getDocumentTitle()}</Title>
                    <Text dangerouslySetInnerHTML={{
                        __html: getDocumentHtml()
                    }} />
                </Content>
            </Page.Content>
        </Page.Container>
    )
}

const Content = styled.div`
    width: 100%;
    
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Title = styled.h1`
    color: var(--c-white);
    font-size: 30px;
    font-weight: 700;

    margin-bottom: 50px;
`;

const Text = styled.p`
    color: var(--c-white);
    font-size: 18px;
    font-weight: 200;
    line-height: 190%;
`;