import {
  Card,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  ListItem,
  TableContainer,
  TableBody,
  Button,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import * as logger from "./../utils/logger";
import { getInvoicesForCustomer } from "./../services/payments";

const InvoiceHistory = (props) => {
  const { t } = useTranslation(["common", "Membership"]);
  const [invoicesArray, setInvoicesArray] = useState([]);
  const userSubscription = useSelector((state) => {
    return state.subscription;
  });
  useEffect(() => {
    logger.log("UseEffect userSubscription");
    logger.log(userSubscription);
    const getInvoices = async () => {
      const resp = await getInvoicesForCustomer(userSubscription.customer);
      logger.log("invoices");
      logger.log(resp?.invoices?.data);
      setInvoicesArray(resp?.invoices?.data);
    };
    if (userSubscription.customer) getInvoices();
  }, [userSubscription]);
  return (
    <div>
      {invoicesArray.length > 0 && (
        <Grid>
          <Card variant="outlined" style={{ margin: "10px auto" }}>
            <h2>{t("Membership:invoiceHistory")}</h2>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("Membership:period")}</TableCell>
                    <TableCell align="right">{t("Membership:amount")}</TableCell>
                    <TableCell align="right">{t("Membership:status")}</TableCell>
                    <TableCell align="right">{t("Membership:invoice")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoicesArray.map((invoice) => {
                    return invoice.paid === true ? (
                      <TableRow
                        key={invoice.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {new Date(invoice.period_start * 1000).toDateString()}
                        </TableCell>
                        <TableCell align="right">
                          {"C$" + invoice.amount_due / 100}
                        </TableCell>
                        {/* {/* <TableCell align="right">{row.fat}</TableCell> */}
                        <TableCell align="right">
                          {invoice.paid === true ? t("Membership:paid") : t("Membership:notPaid")}
                        </TableCell>
                        <TableCell align="right">
                          <a href={invoice.invoice_pdf}>{t("Membership:invoice")}</a>
                        </TableCell>
                      </TableRow>
                    ) : null;
                  })}
                  {/* {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                ))} */}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      )}
    </div>
  );
};
export default InvoiceHistory;
