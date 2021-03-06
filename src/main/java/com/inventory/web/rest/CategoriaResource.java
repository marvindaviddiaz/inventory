package com.inventory.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.inventory.domain.Categoria;
import com.inventory.repository.CategoriaRepository;
import com.inventory.repository.search.CategoriaSearchRepository;
import com.inventory.web.rest.util.HeaderUtil;
import com.inventory.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Categoria.
 */
@RestController
@RequestMapping("/api")
public class CategoriaResource {

    private final Logger log = LoggerFactory.getLogger(CategoriaResource.class);
        
    @Inject
    private CategoriaRepository categoriaRepository;
    
    @Inject
    private CategoriaSearchRepository categoriaSearchRepository;
    
    /**
     * POST  /categorias : Create a new categoria.
     *
     * @param categoria the categoria to create
     * @return the ResponseEntity with status 201 (Created) and with body the new categoria, or with status 400 (Bad Request) if the categoria has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/categorias",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Categoria> createCategoria(@Valid @RequestBody Categoria categoria) throws URISyntaxException {
        log.debug("REST request to save Categoria : {}", categoria);
        if (categoria.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("categoria", "idexists", "A new categoria cannot already have an ID")).body(null);
        }
        Categoria result = categoriaRepository.save(categoria);
        categoriaSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/categorias/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("categoria", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /categorias : Updates an existing categoria.
     *
     * @param categoria the categoria to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated categoria,
     * or with status 400 (Bad Request) if the categoria is not valid,
     * or with status 500 (Internal Server Error) if the categoria couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/categorias",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Categoria> updateCategoria(@Valid @RequestBody Categoria categoria) throws URISyntaxException {
        log.debug("REST request to update Categoria : {}", categoria);
        if (categoria.getId() == null) {
            return createCategoria(categoria);
        }
        Categoria result = categoriaRepository.save(categoria);
        categoriaSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("categoria", categoria.getId().toString()))
            .body(result);
    }

    /**
     * GET  /categorias : get all the categorias.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of categorias in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/categorias",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Categoria>> getAllCategorias(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Categorias");
        Page<Categoria> page = categoriaRepository.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/categorias");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /categorias/:id : get the "id" categoria.
     *
     * @param id the id of the categoria to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the categoria, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/categorias/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Categoria> getCategoria(@PathVariable Long id) {
        log.debug("REST request to get Categoria : {}", id);
        Categoria categoria = categoriaRepository.findOne(id);
        return Optional.ofNullable(categoria)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /categorias/:id : delete the "id" categoria.
     *
     * @param id the id of the categoria to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/categorias/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteCategoria(@PathVariable Long id) {
        log.debug("REST request to delete Categoria : {}", id);
        categoriaRepository.delete(id);
        categoriaSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("categoria", id.toString())).build();
    }

    /**
     * SEARCH  /_search/categorias?query=:query : search for the categoria corresponding
     * to the query.
     *
     * @param query the query of the categoria search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/categorias",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Categoria>> searchCategorias(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Categorias for query {}", query);
        Page<Categoria> page = categoriaSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/categorias");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
