package org.hadatac.entity.pojo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.apache.commons.lang3.text.WordUtils;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrRequest;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.hadatac.console.models.Facet;
import org.hadatac.console.models.FacetHandler;
import org.hadatac.console.models.Pivot;
import org.hadatac.utils.Collections;

import com.typesafe.config.ConfigFactory;

public class InRelationToInstance extends HADatAcThing implements Comparable<InRelationToInstance> {

    public InRelationToInstance() {}

    @Override
    public boolean equals(Object o) {
        if((o instanceof InRelationToInstance) && (((InRelationToInstance)o).getUri().equals(this.getUri()))) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        return getUri().hashCode();
    }

    public Map<HADatAcThing, List<HADatAcThing>> getTargetFacets(
            Facet facet, FacetHandler facetHandler) {
        System.out.println("\nInRelationToInstance getTargetFacets facet: " + facet.toSolrQuery());

        SolrQuery query = new SolrQuery();
        String strQuery = facetHandler.getTempSolrQuery(facet);
        query.setQuery(strQuery);
        query.setRows(0);
        query.setFacet(true);
        query.setFacetLimit(-1);
        query.setParam("json.facet", "{ "
                + "in_relation_to_uri_str:{ "
                + "type: terms, "
                + "field: in_relation_to_uri_str, "
                + "limit: 1000}}");

        try {
            SolrClient solr = new HttpSolrClient.Builder(
                    ConfigFactory.load().getString("hadatac.solr.data") 
                    + Collections.DATA_ACQUISITION).build();
            QueryResponse queryResponse = solr.query(query, SolrRequest.METHOD.POST);
            solr.close();
            Pivot pivot = Pivot.parseQueryResponse(queryResponse);
            return parsePivot(pivot, facet);
        } catch (Exception e) {
            System.out.println("[ERROR] InRelationToInstance.getTargetFacets() - Exception message: " + e.getMessage());
        }

        return null;
    }

    private Map<HADatAcThing, List<HADatAcThing>> parsePivot(Pivot pivot, Facet facet) {
        facet.clearFieldValues("in_relation_to_uri_str");

        Map<HADatAcThing, List<HADatAcThing>> results = new HashMap<HADatAcThing, List<HADatAcThing>>();
        for (Pivot pivot_ent : pivot.children) {
            InRelationToInstance object = new InRelationToInstance();
            object.setUri(pivot_ent.value);
            object.setLabel(WordUtils.capitalize(Entity.find(pivot_ent.value).getLabel()));
            object.setCount(pivot_ent.count);
            object.setField("in_relation_to_uri_str");

            if (!results.containsKey(object)) {
                List<HADatAcThing> children = new ArrayList<HADatAcThing>();
                results.put(object, children);
            }

            Facet subFacet = facet.getChildById(object.getUri());
            subFacet.putFacet("in_relation_to_uri_str", object.getUri());
        }

        return results;
    }

    @Override
    public int compareTo(InRelationToInstance another) {
        if (this.getLabel() != null && another.getLabel() != null) {
            return this.getLabel().compareTo(another.getLabel());
        }
        return this.getUri().compareTo(another.getUri());
    }
}
