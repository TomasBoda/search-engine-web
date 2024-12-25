import { Page, Component } from "@/styles/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

export function IndexScreen() {

    const router = useRouter();

    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    function goToSearch() {
        setLoading(true);
        router.push("/search?query=" + query.trim());
    }
 
    return (
        <IndexPageContainer>
            <IndexPageContent>
                <Content>
                    <Title href="/">Search Engine</Title>

                    <Form>
                        <Component.SearchField
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" ? goToSearch() : {}}
                            placeholder="Type in your search query..."
                        />

                        <Component.Button onClick={goToSearch}>
                        {loading ? "Loading..." : "Search"}
                        </Component.Button>
                    </Form>

                    <Info>
                        <Item href="https://github.com/TomasBoda/search-engine-web" target="_blank">
                            GitHub
                        </Item>

                        <Item href="https://github.com/TomasBoda/search-engine-web/blob/main/README.md" target="_blank">
                            Documentation
                        </Item>
                    </Info>
                </Content>
            </IndexPageContent>
        </IndexPageContainer>
    )
}

const IndexPageContainer = styled(Page.Container)`
    width: 100vw;
    height: 100vh;

    background-color: var(--c-black);
`;

const IndexPageContent = styled(Page.Content)`
    width: 100%;
    height: 100%;
`;

const Content = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled(Link)`
    color: var(--c-white);
    font-size: 40px;
    font-weight: 700;
    text-decoration: none;

    margin-bottom: 20px;
`;

const Form = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px;
    align-items: center;
`;

const Info = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    
    margin-top: 30px;
`;

const Item = styled(Link)`
    color: var(--c-white);
    font-size: 12px;
    font-weight: 400;
    text-decoration: none;

    cursor: pointer;
    opacity: 0.7;

    &:hover {
        text-decoration: underline;
    }
`;