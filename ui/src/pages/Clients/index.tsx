import { memo, useContext, useEffect, useState } from "react";
import { Button, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import { StateContext } from "../../store/DataProvider";
import Page from "../../components/Page";
import ClientTable from "./ClientTable";
import { getClients } from "../../services/api";
import { useCreateClientDialog } from "../../components/Dialog/useCreateClientDialog";

function Clients() {
  const { state, dispatch } = useContext(StateContext);
  const { clients } = state;
  const [filter, setFilter] = useState<string>('');
  const [filterClients, setFilterClients] = useState<IClient[]>([]);

  const [openCreateClientDialog, createClientDialogElement] =
    useCreateClientDialog();

  useEffect(() => {
    getClients().then((clients) =>
      dispatch({ type: "FETCH_ALL_CLIENTS", data: clients })
    );
  }, [dispatch]);

  useEffect(() => {
    setFilterClients(clients);
  }, [clients]);

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    const _clients = clients.filter((item: IClient) => item.firstName.toLowerCase().includes(e.target.value.toLowerCase()) || item.lastName.toLowerCase().includes(e.target.value.toLowerCase()));
    setFilterClients(_clients);
  }

  return (
    <Page>
      <Typography variant="h4" sx={{ textAlign: "start" }}>
        Clients
      </Typography>
      <Stack direction="row" justifyContent="space-between" mt={3} spacing={2}>
        <TextField
          required
          label=""
          placeholder="Search client..."
          size="small"
          value={filter}
          onChange={onFilter}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={() => openCreateClientDialog()}
        >Create new client</Button>
      </Stack>
      <Paper sx={{ margin: "auto", mt: 1 }}>
        <ClientTable clients={filterClients} />
      </Paper>
      {createClientDialogElement}
    </Page>
  );
}

export default memo(Clients);
