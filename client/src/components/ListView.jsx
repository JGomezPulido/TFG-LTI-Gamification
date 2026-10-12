import { createContext, useContext, useState } from "react";
import { Flex, TextField, Button, Grid, Table, Tooltip } from "@radix-ui/themes";
import { MagnifyingGlassIcon, PlusIcon} from "@radix-ui/react-icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Pagination } from "./Pagination";

const CardViewContext = createContext(null);

function useCardViewContext(component){
    const context = useContext(CardViewContext);
    if(!context){
        throw new Error(`CardView.${component} must be rendered within <CardView>`);
    }
    return context;
}

/**
 * ListView es el componente básico que utilizo para renderizar las páginas con listas que se recogen desde el backend. 
 * 
 * Props:
 *  - fetchFnc: Función para recoger datos desde el backend
 *  - queryKey: QueryKey para identificar la query con useQuery
 *  - pageSize: tamaño de la página, 12 objetos por defecto.
 * 
 * Subcomponentes: 
 *  - ListView.SearchBar: barra de búsqueda.
 *  - ListView.Grid: Vista de cudrícula. 
 *      - columns: string. numero de columnas que mostrará la vista
 *      - renderItem: Una función de tipo (item) => ReactComponent para renderizar cada objeto  
 *  - ListView.Table: Vista de tabla.
 *      - columns: array de objetos: {title, render}. En el cual se describe tanto el título de cada columna, como una función de renderizado (item) => ReactComponent
 *  - ListView.CreateButton: Boton de creación de objeto. La prop Show sirve para decidir si el boton ha de renderizarse condicionalmente.
 *  - ListView.Pagination: Componente de paginación.
*/

export default function ListView({fetchFnc, queryKey, pageSize = 12, children}){
    const [name, setName] = useState(""); 
    const [page, setPage] = useState(1);
    
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [...queryKey, { page, pageSize, name }],
        queryFn: ()=>fetchFnc(page, pageSize, name),
        placeholderData: keepPreviousData,
    });

    const list =  data?.items ?? [];
    const totalPages = data?.totalPages ?? 1;

    const search = (evt)=>{
        setName(evt.target.value);
        setPage(1);
    };
    return(
        <CardViewContext.Provider value={{list, page, pageSize, totalPages, isLoading, isError, search, setPage}}>
            <Flex mb="5" direction="column" gap="3" align="center">
                {children}
            </Flex>
        </CardViewContext.Provider>
    );
}

function GridView({renderCard}){
    const { list } = useCardViewContext("Card View");
    return (
        <Grid columns={{initial:"1", sm:"2", lg:"3", xl:"4"}} gap="3" width="auto">
            {list.map((item, i) => (
                <div key={i}>{renderCard(item)}</div>
            ))}
        </Grid>
    );
}

function TableView({columns}){
    const { list } = useCardViewContext("Table View");

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    {columns.map((col, i) => (
                        <Table.ColumnHeaderCell key={i}>{col.title}</Table.ColumnHeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {list.map((item, i) => (
                    <Table.Row key={i}>
                        {columns.map((column, i) => (
                            <Table.Cell key={i}>{column.render(item)}</Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}

function SearchBar({placeholder = "Search..."}){
    const {search} = useCardViewContext("Search Bar");

    return (
        <TextField.Root placeholder={placeholder} onChange={search}>
            <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16"/>
            </TextField.Slot>
        </TextField.Root>
    );
}

function PaginationControl(){
    const {page, totalPages, setPage} = useCardViewContext("Pagination");
    return <Pagination page={page} count={totalPages} onPageChange={setPage}/>
}

function CreateButton({ onClick, show = true, icon = <PlusIcon width="30" height="30" /> }) {
    if (!show) return null;
    return (
        <Tooltip content="Create new">
        <Button className="FloatingButton" variant="classic" color="green" radius="full" onClick={onClick}>
            {icon}
        </Button>
        </Tooltip>
    );
}

ListView.Grid         = GridView;
ListView.Table        = TableView;
ListView.Search       = SearchBar;
ListView.Pagination   = PaginationControl;
ListView.CreateButton = CreateButton;