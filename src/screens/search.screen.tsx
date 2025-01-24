import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Component, Page } from "@/styles/styles";
import { DocumentObject } from "@/pages/search";

export function SearchScreen({ documents }: { documents: DocumentObject[]; }) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState<string>(searchParams.get("query") ?? "");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(false);
    }, [searchParams]);

    function goToSearch() {
        setLoading(true);
        router.replace("/search?query=" + query.trim());
    }

    function getDocumentTitle(document: DocumentObject): string {
        return document.text.split("\n")[0].trim();
    }

    function getDocumentDescription(document: DocumentObject): string {
        return document.text.split("\n").filter(line => line.trim() !== "").slice(1, 3).join(" ");
    }

    return (
        <Page.Container>
            <Page.Content>
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

                    {documents.length > 0 ?
                        <DocumentList>
                            {documents.map((document: DocumentObject) =>
                                <DocumentContainer href={"/documents/" + document.id}>
                                    <DocumentTitle>{getDocumentTitle(document)}</DocumentTitle>
                                    <DocumentDescription>{getDocumentDescription(document)}</DocumentDescription>
                                </DocumentContainer>
                            )}
                        </DocumentList>
                    :
                        <EmptyMessage>No documents found</EmptyMessage>
                    }
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

const Form = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px;
    align-items: center;

    margin-top: 20px;
`;

const Title = styled(Link)`
    color: var(--c-white);
    font-size: 30px;
    font-weight: 700;
    text-decoration: none;
`;

const DocumentList = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: 1fr;
    gap: 0px;

    margin-top: 50px;
`;

const DocumentContainer = styled(Link)`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    text-decoration: none;

    padding: 20px;

    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    transition: all 100ms;
    cursor: pointer;

    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }
`;

const DocumentTitle = styled.div`
    color: var(--c-white);
    font-size: 20px;
    font-weight: 700;

    margin-bottom: 10px;
`;

const DocumentDescription = styled.div`
    color: var(--c-white);
    font-size: 16px;
    font-weight: 300;
    line-height: 170%;
    opacity: 0.5;

    overflow: hidden;
    display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2; 
   -webkit-box-orient: vertical;
`;

const EmptyMessage = styled.div`
    color: white;
    font-size: 15px;
    font-weight: 400;
    line-height: 150%;

    margin-top: 50px;
`;